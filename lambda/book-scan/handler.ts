"use strict";

import AWS from "aws-sdk";

import path from "path";
import uuid from "uuid/v4";

import corsResponse from "../util/corsResponse";

import checkLogin from "../util/checkLoginToken";
import getSecrets from "../util/getSecrets";
import uploadToS3 from "../util/uploadToS3";
import downloadFromUrl from "../util/downloadFromUrl";
import resizeImage from "../util/resizeImage";
import { getOpenLibraryCoverUri } from "../util/bookCoverHelpers";

import fetch from "node-fetch";

import { db, getGetPacket, getPutPacket, getQueryPacket, getUpdatePacket } from "../util/dynamoHelpers";
import { getWsSessionKey } from "./ws-helpers";
import { getScanItemKey, getUserScanStatusKey } from "./scan-helpers";
import { getPendingCount } from "./data-helpers/pendingScanCount";

const SCAN_STATE_TABLE_NAME = "";

enum COVER_SIZE {
  SMALL = 1,
  MEDIUM = 2
}

export const sync = async (event, context) => {
  try {
    const packet = JSON.parse(event.body);
    const messenger = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
    });
    const connectionId = event.requestContext.connectionId;

    console.log("Set up with", event.requestContext.domainName + "/" + event.requestContext.stage);

    const key = getWsSessionKey(connectionId);
    const wsConnection = db.get(getGetPacket(key, key));
    if (!wsConnection) {
      console.log("Connection Dead");
      return;
    }

    await db.update(
      getUpdatePacket(key, key, {
        UpdateExpression: "SET userId = :userId, loginToken = :loginToken, gsiUserWebSocketLookupPk = :userId",
        ExpressionAttributeValues: { ":userId": packet.userId, ":loginToken": packet.loginToken }
      })
    );

    await new Promise(res => {
      messenger.postToConnection(
        { ConnectionId: event.requestContext.connectionId, Data: JSON.stringify({ message: "Hello, World TWO Baby " }) },
        (err, data) => {
          res({});
          console.log("CALLBACK", "ERROR", err, "DATA", data);
        }
      );
    });
  } catch (er) {
    console.log("ERROR in foo", er);
  }

  return {
    statusCode: 200
  };
};

export const scanBook = async event => {
  try {
    const { userId = "", loginToken, isbn } = JSON.parse(event.body);

    if (!(await checkLogin(userId, loginToken))) {
      return corsResponse({ badLogin: true });
    }

    const [pk, sk] = getScanItemKey();
    const scanStatusKey = getUserScanStatusKey(userId);

    try {
      let res = await db.transactWrite({
        ReturnConsumedCapacity: "TOTAL",
        TransactItems: [
          {
            Put: getPutPacket({ pk, sk, isbn, userId })
          },
          {
            Update: getUpdatePacket(scanStatusKey, scanStatusKey, {
              UpdateExpression: "ADD #pendingCount :one",
              ExpressionAttributeValues: { ":one": 1 },
              ExpressionAttributeNames: { "#pendingCount": "pendingCount" }
            })
          }
        ]
      });
      const pendingCount = await getPendingCount(userId, true);
      console.log("transaction result", res);
      return corsResponse({ success: true, pendingCount });
    } catch (er) {
      console.log("ERROR", er);
    }
  } catch (err) {
    return corsResponse({ success: false, err });
  }
};

export const streamHandler = async event => {
  const records = event.Records || [];
  for (const record of records) {
    console.log("Inspecting", JSON.stringify(record));
    const newImage = record?.dynamodb?.NewImage;
    if (!newImage) {
      continue;
    }
    const pk = newImage.pk.S;

    if (pk.startsWith("UserScanStatus")) {
      const userId = pk.split("#")[1];

      const items = await db.query(
        getQueryPacket(` gsiUserWebSocketLookupPk = :userId `, {
          IndexName: "gsiUserWebSocketLookup",
          ExpressionAttributeValues: { ":userId": userId }
        })
      );
      console.log("Items found", JSON.stringify(items));

      for (let item of items) {
        const messenger = new AWS.ApiGatewayManagementApi({
          apiVersion: "2018-11-29",
          endpoint: item.endpoint
        });
        const connectionId = item["connection-id"];

        console.log("POSTING", { connectionId, endpoint: item.endpoint });
        await messenger.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify({ message: "Sending update" }) }).promise();
      }
    }
  }

  try {
    console.log("Records", event.Records);
    console.log(
      "Records objects",
      (event.Records || []).map(o => JSON.stringify(o.dynamodb))
    );
  } catch (e) {
    console.log("ERROR", e);
  }
};

export const lookupBooks = async event => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
    let mongoDb: any;

    const params = {
      TableName: SCAN_STATE_TABLE_NAME,
      Key: { id: 1 }
    };
    const result = await dynamoDb.get(params).promise();
    if (!result?.Item?.pendingEntries?.length) {
      return { success: true, empty: true };
    }

    const pendingEntries = result.Item.pendingEntries;
    const itemLookup = pendingEntries.reduce((hash, entry) => ((hash[entry.isbn] = entry), hash), {});
    const secrets = await getSecrets();
    const isbnDbKey = secrets["isbn-db-key"];

    const isbns = pendingEntries.map(entry => entry.isbn).join(",");
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

    for (const item of json.data) {
      let newBook = await getBookFromIsbnDbModel(item, "60a93babcc3928454b5d1cc6"); //TODO:
      console.log("Saving", JSON.stringify(newBook));
      await mongoDb.collection("books").insertOne(newBook);
    }

    console.log("---- FINISHED. ALL SAVED ----");
    return { success: true };
  } catch (err) {
    return { success: false, err };
  }
};

const __sandbox = async event => {
  try {
    let mongoDb: any;
    const { isbn } = JSON.parse(event.body);

    await mongoDb.collection("pendingEntries").insertOne({ isbn });

    const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

    const params = {
      TableName: SCAN_STATE_TABLE_NAME,
      Item: {
        id: 1,
        items: ["a", "b"]
      }
      // ConditionExpression: "id <> :idKeyVal",
      // ExpressionAttributeValues: {
      //   ":idKeyVal": 1
      // }
    };
    await dynamoDb.put(params).promise();

    const x = await dynamoDb.get({ TableName: SCAN_STATE_TABLE_NAME, Key: { id: 1 } }).promise();

    await dynamoDb
      .update({
        TableName: SCAN_STATE_TABLE_NAME,
        Key: { id: 2 },
        UpdateExpression: "set loginKey = :login",
        ExpressionAttributeValues: { ":login": "abc123" }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: SCAN_STATE_TABLE_NAME,
        Key: { id: 3 },
        UpdateExpression: "set loginKey = :login",
        ExpressionAttributeValues: { ":login": "abc123" }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: SCAN_STATE_TABLE_NAME,
        Key: { id: 4 },
        UpdateExpression: "ADD notificationPaths :newPath",
        ExpressionAttributeValues: { ":newPath": dynamoDb.createSet(["path-yo"]) }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: SCAN_STATE_TABLE_NAME,
        Key: { id: 4 },
        UpdateExpression: "ADD notificationPaths :newPath SET aaa = :list",
        ExpressionAttributeValues: { ":newPath": dynamoDb.createSet(["path-yo-2"]), ":list": ["f", "g"] }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: SCAN_STATE_TABLE_NAME,
        Key: { id: 4 },
        UpdateExpression: "SET aaa = :list DELETE notificationPaths :oldPath",
        ExpressionAttributeValues: { ":list": ["f", "g"], ":oldPath": dynamoDb.createSet(["path-yo"]) }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: SCAN_STATE_TABLE_NAME,
        Key: { id: 66 },
        UpdateExpression: "SET myset = :set",
        ExpressionAttributeValues: { ":set": dynamoDb.createSet(["a", "b", "c"]) }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: SCAN_STATE_TABLE_NAME,
        Key: { id: 4 },
        UpdateExpression: "SET notificationPaths = :junk",
        ExpressionAttributeValues: { ":junk": "NOOO", ":idKeyVal": 4 },
        ConditionExpression: "id <> :idKeyVal"
      })
      .promise();

    return corsResponse({ success: true, stage: process.env.stage, val: JSON.stringify(x), val2: x.Item.items[0] });
  } catch (err) {
    return corsResponse({ success: false, error: err });
  }
};

async function getBookFromIsbnDbModel(book, userId) {
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
      source: "synopsys",
      content: book.synopsys
    });
  }

  if (book.overview) {
    newBook.editorialReviews.push({
      source: "overview",
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

export const stickItIn = async event => {
  console.log("CALLED YO", +new Date());

  try {
    const db = new AWS.DynamoDB({
      region: "us-east-1"
    });

    const params = {
      TableName: "my_library_scan_state_live",
      Item: {
        id: { N: "1" },
        items: { L: [{ S: "a" }, { S: "xyzabc" }] }
      },
      ConditionExpression: "id <> :idKeyVal",
      ExpressionAttributeValues: {
        ":idKeyVal": { N: "1" }
      }
    };
    await db.putItem(params).promise();
    console.log("INSERTED");
  } catch (err) {
    console.log("ERROR :(", err);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event
      },
      null,
      2
    )
  };
};
