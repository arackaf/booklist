import path from "path";

import fetch from "node-fetch";
import { v4 as uuid } from "uuid";

import { db, getDeletePacket, getPutPacket, TABLE_NAME } from "../../../util/dynamoHelpers";
import getSecrets from "../../../util/getSecrets";
import { getBookLookupsFree, getPendingCount, getScanItemBatch, getStatusCountUpdate, ScanItem } from "./data-helpers";
import { getCurrentLookupFullKey, getScanResultKey } from "./key-helpers";
import { getOpenLibraryCoverUri } from "../../../util/bookCoverHelpers";
import downloadFromUrl from "../../../util/downloadFromUrl";
import { getDbConnection } from "../../../util/getDbConnection";
import { sendWsMessageToUser } from "./ws-helpers";

import { handleCover } from "../../../util/handleCover";

type BookLookupPacket = {
  pk: string;
  sk: string;
  scanItems: ScanItem[];
};

export const runBookLookupIfAble = async () => {
  const lookupsFree = await getBookLookupsFree();
  console.log("BOOK LOOKUP STATUS", JSON.stringify(lookupsFree));

  if (!lookupsFree.free0 && !lookupsFree.free1) {
    return;
  }

  if (lookupsFree.free0) {
    await setupLookup(0);
  }
  if (lookupsFree.free1) {
    await setupLookup(1);
  }
};

export const setupLookup = async lookupIdx => {
  const [pk, sk] = getCurrentLookupFullKey(lookupIdx);
  let scanPacket;

  for (let i = 1; i <= 3; i++) {
    try {
      const scanItems: ScanItem[] = await getScanItemBatch();

      if (!scanItems.length) {
        console.log("No scan items remaining");
        return;
      }

      console.log("Scan items found", scanItems.length, scanItems);

      scanPacket = {
        pk,
        sk,
        scanItems
      };

      console.log("SCAN PACKET SETUP", lookupIdx, scanItems);

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
              Put: getPutPacket(scanPacket, {
                ConditionExpression: "attribute_not_exists(#sk)",
                ExpressionAttributeNames: {
                  "#sk": "sk"
                }
              })
            }
          ]
        },
        1
      );
      console.log("Setup success, doing lookup");
      await doLookup(scanPacket);
      return;
    } catch (err) {
      console.log("Scan packet setup transaction error", err);
    }
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

    const secrets = await getSecrets();
    const isbnDbKey = secrets["isbn-db-key"];

    const isbns = [...new Set(scanItems.map(entry => entry.isbn))].join(",");
    const userIds = [...new Set(scanItems.map(entry => entry.userId))];
    console.log("---- BOOK LOOKUP STARTING ----", isbns);

    const isbnDbResponse = await fetch(`https://api2.isbndb.com/books`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: isbnDbKey
      },
      body: `isbns=${isbns}`
    });
    const json: any = await isbnDbResponse.json();

    const allResults = Array.isArray(json?.data) ? json.data : [];
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
        const { db: mongoDb, client: mongoClient } = await getDbConnection();
        await mongoDb.collection("books").insertOne(newBookMaybe);
        await mongoClient.close();

        userMessages[newBookMaybe.userId].results.push({ success: true, item: newBookMaybe });
        const { title, smallImage } = newBookMaybe as any;
        await db.put(getPutPacket({ pk, sk, success: true, title, smallImage, expires }));
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

    const waitFor = 1000 - (endTime - startTime);
    await wait(Math.max(waitFor, 0));
    console.log("---- Waiting .... ----", waitFor);

    return { success: true };
  } catch (err) {
    console.log("BOOK LOOKUP ERROR", err);
    return { success: false, err };
  }
};

const getEmptyImageData = () => ({
  mobileImage: "",
  mobileImagePreview: "",
  smallImage: "",
  smallImagePreview: "",
  mediumImage: "",
  mediumImagePreview: ""
});

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type ProcessCoverResults = UnwrapPromise<ReturnType<typeof processCoverUrl>>;

const syncImageData = (results: ProcessCoverResults, imageData: ReturnType<typeof getEmptyImageData>) => {
  if (!imageData.mobileImage && results?.mobile.STATUS === "success") {
    imageData.mobileImage = results?.mobile?.image.url;
    imageData.mobileImagePreview = results.mobile.image.preview;
  }
  if (!imageData.smallImage && results?.small.STATUS === "success") {
    imageData.smallImage = results?.small?.image.url;
    imageData.smallImagePreview = results.small.image.preview;
  }
  if (!imageData.mediumImage && results?.medium.STATUS === "success") {
    imageData.mediumImage = results?.medium?.image.url;
    imageData.mediumImagePreview = results.medium.image.preview;
  }
};

async function getBookFromIsbnDbData(book, userId) {
  console.log("Processing", JSON.stringify(book));

  let isbn = book.isbn13 || book.isbn;

  let imageData = getEmptyImageData();
  let initialCoverResults = await processCoverUrl(book.image, isbn, userId);

  syncImageData(initialCoverResults, imageData);
  if (!imageData.mobileImage || !imageData.smallImage || !imageData.mediumImage) {
    console.log("One or more covers missing, trying OpenLibrary");

    let imageResult = await processCoverUrl(getOpenLibraryCoverUri(isbn), isbn, userId);
    syncImageData(imageResult, imageData);
  }

  const newBook = {
    title: book.title || book.title_long,
    isbn,
    ean: "",
    pages: book.pages,
    ...imageData,
    publicationDate: book.date_published, // TODO
    publisher: book.publisher,
    authors: book.authors || [],
    editorialReviews: [],
    subjects: [],
    userId
  };

  if (book.synopsys) {
    newBook.editorialReviews.push({
      source: "Synopsys",
      content: book.synopsys
    });
  }

  if (book.overview) {
    newBook.editorialReviews.push({
      source: "Overview",
      content: book.overview
    });
  }

  return newBook;
}

async function processCoverUrl(url, isbn, userId) {
  const { body, error } = await downloadFromUrl(url);

  if (error) {
    return null;
  }
  const extension = path.extname(url) || ".jpg";
  const filePath = `${userId}/${uuid()}${extension}`;

  const allResults = await Promise.all([
    handleCover(body, "mobile", `mobile-covers/${filePath}`),
    handleCover(body, "small", `small-covers/${filePath}`),
    handleCover(body, "medium", `medium-covers/${filePath}`)
  ]);

  if (allResults.every(r => r.STATUS === "error") || allResults.every(r => r.STATUS === "invalid-size")) {
    return null;
  }

  const [mobile, small, medium] = allResults;

  return {
    mobile,
    small,
    medium
  };
}
