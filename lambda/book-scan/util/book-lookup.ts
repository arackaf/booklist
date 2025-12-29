import { eq, inArray, InferInsertModel } from "drizzle-orm";

import * as schema from "../drizzle/drizzle-schema";

import { getPendingCount, getScanItemBatch, ScanItem } from "./data-helpers";
import { finishBookInfo, brightDataLookup, BookLookupResult } from "./book-fetch";
import { sendWsMessageToUser } from "./ws-helpers";
import { initializePostgres } from "./pg-helper";
import { bookScans } from "../drizzle/drizzle-schema";

type PostgresBookObject = InferInsertModel<typeof schema.books>;

export const runBookLookupIfAvailable = async () => {
  try {
    const scanItems: ScanItem[] = await getScanItemBatch();

    if (!scanItems.length) {
      console.log("No scan items remaining");
      return;
    }

    console.log("Scan items found", scanItems.length, scanItems);

    console.log("Doing lookup ...");
    await doLookup(scanItems);
  } catch (err) {
    console.log("Scan packet setup transaction error", err);
  }
};

export const doLookup = async (scanItems: ScanItem[]) => {
  await lookupBooks(scanItems);

  const users = [...new Set(scanItems.map(item => item.userId))];

  for (const userId of users) {
    console.log("Getting new pending count for", userId);
    const pendingCount = await getPendingCount(userId);
    console.log("Pending count for", userId, pendingCount, "Sending ws message");
    await sendWsMessageToUser(userId, { type: "pendingCountSet", pendingCount });
  }
};

const wait = ms => new Promise(res => setTimeout(res, ms));

export const lookupBooks = async (scanItems: ScanItem[]) => {
  try {
    const startTime = +new Date();
    const userIds = [...new Set(scanItems.map(entry => entry.userId))];

    const allResults = await brightDataLookup(scanItems);

    console.log("Books constructed from Bright Data:", allResults);

    const allBookDownloads = [];

    const scanItemResults = scanItems.map(item => {
      return {
        ...item,
        success: false,
        book: null as (BookLookupResult & { userId: string }) | null
      };
    });

    for (const scanInput of scanItemResults) {
      const foundBook = allResults.find(book => book.isbn13 === scanInput.isbn || book.isbn10 === scanInput.isbn);

      if (foundBook) {
        allBookDownloads.push(
          (async function () {
            try {
              await finishBookInfo(foundBook, scanInput.userId);

              scanInput.success = true;
              scanInput.book = {
                ...foundBook,
                userId: scanInput.userId
              };
            } catch (er) {}
          })()
        );
      }
    }

    await Promise.race([wait(5000), Promise.all(allBookDownloads)]);

    const userMessages = userIds.reduce<{ [k: string]: { results: any[] } }>((hash, userId) => {
      hash[userId] = { results: [] };
      return hash;
    }, {});

    console.log("Book lookup results", JSON.stringify(scanItemResults));

    const booksToInsert: PostgresBookObject[] = [];
    for (const item of scanItemResults) {
      if (item.success) {
        const bookToInsert = item.book;
        const book: PostgresBookObject = {
          title: bookToInsert.title,
          pages: bookToInsert.pages ?? null,
          authors: bookToInsert.authors ?? [],
          isbn: bookToInsert.isbn,
          publisher: bookToInsert.publisher,
          publicationDate: bookToInsert.publicationDate,
          isRead: false,
          mobileImage: bookToInsert.mobileImage,
          mobileImagePreview: bookToInsert.mobileImagePreview ?? null,
          smallImage: bookToInsert.smallImage,
          smallImagePreview: bookToInsert.smallImagePreview ?? null,
          mediumImage: bookToInsert.mediumImage,
          mediumImagePreview: bookToInsert.mediumImagePreview ?? null,
          editorialReviews: bookToInsert.editorialReviews ?? [],
          userId: bookToInsert.userId,
          dateAdded: new Date()
        };
        booksToInsert.push(book);

        try {
          const { title, authors, smallImage, smallImagePreview } = item.book as any;
          userMessages[item.userId].results.push({ success: true, item: { title, authors, smallImage, smallImagePreview } });
        } catch (err) {
          userMessages[item.userId].results.push({ success: false, item: { title: `Error saving ${item.isbn}` } });
        }
      } else {
        userMessages[item.userId].results.push({ success: false, item: { title: `Failed lookup for ${item.isbn}` } });
      }
    }

    const postgresDb = await initializePostgres();

    const successPackets = scanItemResults.filter(item => item.success).map(item => ({ id: item.id, book: item.book }));
    const failureIds = scanItemResults.filter(item => !item.success).map(item => item.id);

    postgresDb.transaction(async tx => {
      for (const packet of successPackets) {
        await tx
          .update(schema.bookScans)
          .set({
            status: "SUCCESS",
            bookInfo: {
              title: packet.book.title,
              authors: packet.book.authors,
              smallImage: packet.book.smallImage,
              smallImagePreview: packet.book.smallImagePreview
            }
          })
          .where(eq(bookScans.id, packet.id));
      }

      if (failureIds.length) {
        await tx.update(schema.bookScans).set({ status: "FAILURE" }).where(inArray(bookScans.id, failureIds));
      }

      if (booksToInsert.length) {
        await tx.insert(schema.books).values(booksToInsert);
      }
    });

    console.log("---- FINISHED. ALL SAVED AND SYNCD WITH FLY ----");

    await wait(3000);

    for (const [userId, packet] of Object.entries(userMessages)) {
      sendWsMessageToUser(userId, { type: "scanResults", packet });
    }

    const endTime = +new Date();

    console.log("---- Time elapsed .... ----", endTime - startTime);

    return { success: true };
  } catch (err) {
    console.log("BOOK LOOKUP ERROR", err);
    return { success: false, err };
  }
};
