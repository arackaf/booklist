import { v4 as uuid } from "uuid";
import { InferInsertModel } from "drizzle-orm";

import * as schema from "../drizzle/drizzle-schema";

import { db, getDeletePacket, getPutPacket, TABLE_NAME } from "./dynamoHelpers";

import { getPendingCount, getScanItemBatch, getStatusCountUpdate, ScanItem } from "./data-helpers";
import { getBookFromIsbnDbData, isbnDbLookup } from "./isbn-db-utils";
import { getScanResultKey } from "./key-helpers";
import { sendWsMessageToUser } from "./ws-helpers";
import { getSecrets } from "./getSecrets";
import { initializePostgres } from "./pg-helper";

type PostgresBookObject = InferInsertModel<typeof schema.books>;

type BookLookupPacket = {
  pk: string;
  sk: string;
  scanItems: ScanItem[];
};

export const runBookLookupIfAvailable = async () => {
  try {
    const scanItems: ScanItem[] = await getScanItemBatch();

    if (!scanItems.length) {
      console.log("No scan items remaining");
      return;
    }

    console.log("Scan items found", scanItems.length, scanItems);

    console.log("Doing lookup");
    await doLookup(scanItems);
  } catch (err) {
    console.log("Scan packet setup transaction error", err);
  }
};

export const doLookup = async (scanItems: ScanItem[]) => {
  await lookupBooks(scanItems);

  const users = [...new Set(scanItems.map(item => item.userId))];

  for (const [userId] of users) {
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

    const allResults = await isbnDbLookup(scanItems);
    const allBookDownloads = [];

    const scanInputs: any[] = scanItems.map(item => {
      return {
        ...item,
        unSuccessfulLookup: true
      };
    });

    for (const book of allResults) {
      for (const scanInput of scanInputs) {
        if (scanInput.unSuccessfulLookup && (scanInput.isbn === book.isbn13 || scanInput.isbn === book.isbn)) {
          allBookDownloads.push(
            (async function () {
              try {
                const newBook = await getBookFromIsbnDbData(book, scanInput.userId);
                const idx = scanInputs.indexOf(scanInput);

                scanInputs[idx] = newBook;
              } catch (er) {}
            })()
          );
        }
      }
    }

    await Promise.race([wait(5000), Promise.all(allBookDownloads)]);

    const userMessages = userIds.reduce<{ [k: string]: { results: any[] } }>((hash, userId) => {
      hash[userId] = { results: [] };
      return hash;
    }, {});

    console.log("Book lookup results", JSON.stringify(scanInputs));

    const booksToInsert: PostgresBookObject[] = [];
    for (const newBookMaybe of scanInputs) {
      const [pk, sk, expires] = getScanResultKey(newBookMaybe.userId);

      if (!newBookMaybe.unSuccessfulLookup) {
        const bookToInsert = newBookMaybe as any;
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
          const { title, authors, smallImage, smallImagePreview } = newBookMaybe as any;
          userMessages[newBookMaybe.userId].results.push({ success: true, item: { title, authors, smallImage, smallImagePreview } });
          await db.put(getPutPacket({ pk, sk, success: true, title, smallImage, smallImagePreview, expires }));
        } catch (err) {
          userMessages[newBookMaybe.userId].results.push({ success: false, item: { _id: uuid(), title: `Error saving ${newBookMaybe.isbn}` } });
          await db.put(getPutPacket({ pk, sk, success: false, title: "Error saving to pg", isbn: newBookMaybe.isbn, expires }));
        }
      } else {
        userMessages[newBookMaybe.userId].results.push({ success: false, item: { _id: uuid(), title: `Failed lookup for ${newBookMaybe.isbn}` } });
        await db.put(getPutPacket({ pk, sk, success: false, isbn: newBookMaybe.isbn, expires }));
      }
    }

    const postgresDb = await initializePostgres();
    await postgresDb.insert(schema.books).values(booksToInsert);

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
