import path from "path";

import AWS from "aws-sdk";
import fetch from "node-fetch";
import { v4 as uuid } from "uuid";

import { db, getDeletePacket, getPutPacket, TABLE_NAME } from "../../util/dynamoHelpers";
import getSecrets from "../../util/getSecrets";
import { getBookLookupsFree, getScanItemBatch, getStatusCountUpdate, ScanItem } from "./data-helpers";
import { getCurrentLookupFullKey } from "./key-helpers";
import { getOpenLibraryCoverUri } from "../../util/bookCoverHelpers";
import downloadFromUrl from "../../util/downloadFromUrl";
import resizeImage from "../../util/resizeImage";
import uploadToS3 from "../../util/uploadToS3";
import getDbConnection from "../../util/getDbConnection";
import { sendWsMessageToUser } from "./ws-helpers";

enum COVER_SIZE {
  SMALL = 1,
  MEDIUM = 2
}

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
};

const wait = ms => new Promise(res => setTimeout(res, ms));

export const lookupBooks = async (scanItems: ScanItem[]) => {
  try {
    const startTime = +new Date();
    const mongoDb = await getDbConnection();

    const secrets = await getSecrets();
    const isbnDbKey = secrets["isbn-db-key"];

    const isbns = [...new Set(scanItems.map(entry => entry.isbn))].join(",");
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
    const json = await isbnDbResponse.json();

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

    console.log("Book lookup results", JSON.stringify(scanItems));
    for (const newBookMaybe of scanItems) {
      if (!newBookMaybe.pk) {
        await mongoDb.collection("books").insertOne(newBookMaybe);
        sendWsMessageToUser(newBookMaybe.userId, { type: "bookAdded", packet: newBookMaybe });
      } else {
        // TODO: send ws scan failure
      }
    }

    console.log("---- FINISHED. ALL SAVED ----");

    const endTime = +new Date();

    const waitFor = endTime - startTime;
    await wait(waitFor);
    console.log("---- Waiting .... ----", waitFor);

    return { success: true };
  } catch (err) {
    console.log("BOOK LOOKUP ERROR", err);
    return { success: false, err };
  }
};

async function getBookFromIsbnDbData(book, userId) {
  console.log("Processing", JSON.stringify(book));

  let isbn = book.isbn13 || book.isbn;

  let smallImage = await processCoverUrl(book.image, isbn, userId, COVER_SIZE.SMALL);
  let mediumImage = await processCoverUrl(book.image, isbn, userId, COVER_SIZE.MEDIUM);

  const newBook = {
    title: book.title || book.title_long,
    isbn,
    ean: "",
    pages: book.pages,
    smallImage,
    mediumImage,
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

async function processCoverUrl(url, isbn, userId, size: COVER_SIZE) {
  if (url) {
    let imageResult = await attemptImageSave(url, userId, size);
    if (imageResult.success) {
      console.log("Default image succeeded", imageResult.url);
      return imageResult.url;
    } else {
      console.log("Default failed", imageResult.message);
      if (isbn) {
        console.log("Trying OpenLibrary");

        let imageResult = await attemptImageSave(getOpenLibraryCoverUri(isbn), userId, size);
        if (imageResult.success) {
          console.log("OpenLibrary succeeded", imageResult.url);
          return imageResult.url;
        }
      }
    }
  }

  return "";
}

async function attemptImageSave(url, userId, size: COVER_SIZE) {
  console.log("Processing", url, size == COVER_SIZE.SMALL ? "small" : "medium");

  const targetWidth = size == COVER_SIZE.SMALL ? 50 : size == COVER_SIZE.MEDIUM ? 106 : 200;
  const minWidth = size == COVER_SIZE.SMALL ? 45 : size == COVER_SIZE.MEDIUM ? 95 : 180;

  const { body, error } = (await downloadFromUrl(url)) as any;

  if (error) {
    return { error: true, message: error || "" };
  }

  const imageResult: any = await resizeImage(body, targetWidth, minWidth);
  if (imageResult.error || !imageResult.body) {
    console.log(url, "failed", imageResult.error);
    return { error: true, message: imageResult.error || "" };
  }

  const newName = `bookCovers/${userId}/${uuid()}${path.extname(url) || ".jpg"}`;
  console.log(url, "success", "Saving to", newName);

  const s3Result: any = await uploadToS3(newName, imageResult.body);

  if (s3Result.success) {
    console.log(s3Result.url, "Saved to s3");
  } else {
    console.log(s3Result.url, "Failed saving to s3");
  }

  return s3Result;
}
