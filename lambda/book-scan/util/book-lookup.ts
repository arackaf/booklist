import { v4 as uuid } from "uuid";

import { db, getDeletePacket, getPutPacket, TABLE_NAME } from "../../util/dynamoHelpers";
import { getConnection } from "../../util/getDbConnection";

import { getPendingCount, getScanItemBatch, getStatusCountUpdate, ScanItem } from "./data-helpers";
import { getBookFromIsbnDbData, isbnDbLookup } from "./isbn-db-utils";
import { getScanResultKey } from "./key-helpers";
import { sendWsMessageToUser } from "./ws-helpers";

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
  const scanItems: ScanItem[] = scanPacket.scanItems;

  await lookupBooks(scanPacket.scanItems);

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

export const lookupBooks = async (scanItems: ScanItem[]) => {
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

    const connection = await getConnection();

    for (const newBookMaybe of scanItems) {
      const [pk, sk, expires] = getScanResultKey(newBookMaybe.userId);

      if (!newBookMaybe.pk) {
        const book = newBookMaybe as any;
        await connection.execute(
          `      
          INSERT INTO books (
            title,
            pages,
            authors,
            isbn,
            publisher,
            publicationDate,
            isRead,
            mobileImage,
            mobileImagePreview,
            smallImage,
            smallImagePreview,
            mediumImage,
            mediumImagePreview,
            editorialReviews,
            userId,
            dateAdded
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            book.title,
            book.pages ?? null,
            JSON.stringify(book.authors ?? []),
            book.isbn,
            book.publisher,
            book.publicationDate,
            book.isRead ?? false,
            book.mobileImage,
            JSON.stringify(book.mobileImagePreview ?? null),
            book.smallImage,
            JSON.stringify(book.smallImagePreview ?? null),
            book.mediumImage,
            JSON.stringify(book.mediumImagePreview ?? null),
            JSON.stringify(book.editorialReviews ?? []),
            book.userId,
            new Date()
          ]
        );

        const { title, authors, smallImage, smallImagePreview } = newBookMaybe as any;
        userMessages[newBookMaybe.userId].results.push({ success: true, item: { title, authors, smallImage, smallImagePreview } });
        await db.put(getPutPacket({ pk, sk, success: true, title, smallImage, smallImagePreview, expires }));
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
