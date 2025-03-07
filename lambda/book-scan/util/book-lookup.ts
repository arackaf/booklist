import { v4 as uuid } from "uuid";

import { db, getDeletePacket, getPutPacket, TABLE_NAME } from "../../util/dynamoHelpers";

import { getPendingCount, getScanItemBatch, getStatusCountUpdate, ScanItem } from "./data-helpers";
import { getBookFromIsbnDbData, isbnDbLookup } from "./isbn-db-utils";
import { getScanResultKey } from "./key-helpers";
import { sendWsMessageToUser } from "./ws-helpers";
import { getSecrets } from "../../util/getSecrets";

const MY_LIBRARY_URL = "https://mylibrary.io";

type BookLookupPacket = {
  pk: string;
  sk: string;
  scanItems: ScanItem[];
};

export const runBookLookupIfAvailable = async () => {
  const key = `BookLookup#${uuid()}`;

  let scanPacket;

  try {
    const scanItems: ScanItem[] = await getScanItemBatch();

    if (!scanItems.length) {
      console.log("No scan items remaining");
      return;
    }

    console.log("Scan items found", scanItems.length, scanItems);

    const timestamp = +new Date();

    scanPacket = {
      pk: "BookLookup",
      sk: key,
      scanItems,
      expires: Math.round(timestamp / 1000) + 60 * 60 * 24 // 1 day
    };

    console.log("SCAN PACKET SETUP", scanItems);

    await db.transactWrite(
      {
        TransactItems: [
          ...scanItems.map(({ pk, sk }) => ({
            Delete: {
              Key: { pk, sk },
              TableName: TABLE_NAME,
              ConditionExpression: "attribute_exists(#sk)",
              ExpressionAttributeNames: {
                "#sk": "sk"
              }
            }
          })),
          {
            Put: getPutPacket(scanPacket)
          }
        ]
      },
      3
    );
    console.log("Setup success, doing lookup");
    await doLookup(scanPacket);
  } catch (err) {
    console.log("Scan packet setup transaction error", err);
  }
};

export const doLookup = async (scanPacket: BookLookupPacket) => {
  const secrets = await getSecrets();

  const pgInsertSecret = secrets["pg-save-book-key"];
  const scanItems: ScanItem[] = scanPacket.scanItems;

  await lookupBooks(scanPacket.scanItems, pgInsertSecret);

  const userUpdateMap = scanItems.reduce((hash, { userId }) => {
    if (!hash.hasOwnProperty(userId)) {
      hash[userId] = 0;
    }
    hash[userId]--;
    return hash;
  }, {});

  console.log("Post lookup - Updating status counts", JSON.stringify(userUpdateMap));

  await db.transactWrite({
    TransactItems: [
      {
        Delete: getDeletePacket({ pk: scanPacket.pk, sk: scanPacket.sk })
      },
      ...Object.entries(userUpdateMap).map(([userId, amount]) => {
        return {
          Update: getStatusCountUpdate(userId, amount)
        };
      })
    ]
  });
  console.log("Post lookup - Updating status counts Complete", JSON.stringify(userUpdateMap));

  for (const [userId] of Object.entries(userUpdateMap)) {
    console.log("Getting new pending count for", userId);
    const pendingCount = await getPendingCount(userId, true);
    console.log("Pending count for", userId, pendingCount, "Sending ws message");
    await sendWsMessageToUser(userId, { type: "pendingCountSet", pendingCount });
  }
};

const wait = ms => new Promise(res => setTimeout(res, ms));

export const lookupBooks = async (scanItems: ScanItem[], pgInsertSecret: string) => {
  try {
    const startTime = +new Date();
    const userIds = [...new Set(scanItems.map(entry => entry.userId))];

    const allResults = await isbnDbLookup(scanItems);
    const allBookDownloads = [];

    for (const book of allResults) {
      for (const scanInput of scanItems) {
        if (scanInput.pk && (scanInput.isbn === book.isbn13 || scanInput.isbn === book.isbn)) {
          allBookDownloads.push(
            (async function () {
              try {
                const newBook = await getBookFromIsbnDbData(book, scanInput.userId);
                const idx = scanItems.indexOf(scanInput);
                (scanItems as any)[idx] = newBook;
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

    console.log("Book lookup results", JSON.stringify(scanItems));

    for (const newBookMaybe of scanItems) {
      const [pk, sk, expires] = getScanResultKey(newBookMaybe.userId);

      if (!newBookMaybe.pk) {
        const bookToInsert = newBookMaybe as any;
        const book = {
          title: bookToInsert.title,
          pages: bookToInsert.pages ?? null,
          authors: JSON.stringify(bookToInsert.authors ?? []),
          isbn: bookToInsert.isbn,
          publisher: bookToInsert.publisher,
          publicationDate: bookToInsert.publicationDate,
          isRead: false,
          mobileImage: bookToInsert.mobileImage,
          mobileImagePreview: JSON.stringify(bookToInsert.mobileImagePreview ?? null),
          smallImage: bookToInsert.smallImage,
          smallImagePreview: JSON.stringify(bookToInsert.smallImagePreview ?? null),
          mediumImage: bookToInsert.mediumImage,
          mediumImagePreview: JSON.stringify(bookToInsert.mediumImagePreview ?? null),
          editorialReviews: JSON.stringify(bookToInsert.editorialReviews ?? []),
          userId: bookToInsert.userId,
          dateAdded: new Date()
        };

        console.log("Saving book to Postgres", book);

        try {
          const result = await fetch(`${MY_LIBRARY_URL}/api/save-book`, {
            method: "POST",
            body: JSON.stringify({ book, secret: pgInsertSecret }),
            headers: {
              "Content-Type": "application/json"
            }
          });
          if (!result.ok) {
            throw new Error(`Error saving book to pg ${result.status}`);
          }

          console.log("Book saved to Postgres", book);

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

    console.log("---- FINISHED. ALL SAVED ----");

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
