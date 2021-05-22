"use strict";

import AWS from "aws-sdk";

import corsResponse from "../util/corsResponse";
import getDbConnection from "../util/getDbConnection";

import checkLogin from "../util/checkLoginToken";
import getSecrets from "../util/getSecrets";

import fetch from "node-fetch";

const SCAN_STATE_TABLE_NAME = `my_library_scan_state_${process.env.stage}`;

export const scanBook = async event => {
  try {
    const { userId = "", loginToken, isbn } = JSON.parse(event.body);

    if (!(await checkLogin(userId, loginToken))) {
      return corsResponse({ badLogin: true });
    }

    const db = await getDbConnection();

    await db.collection("pendingEntries").insertOne({ userId, isbn });

    const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
    const scanState = await dynamoDb.get({ TableName: SCAN_STATE_TABLE_NAME, Key: { id: 1 } }).promise();

    if (!scanState.Item) {
      const items = await db
        .collection("pendingEntries")
        .aggregate([{ $sort: { _id: 1 } }, { $limit: 10 }])
        .toArray();

      await dynamoDb
        .put({
          TableName: SCAN_STATE_TABLE_NAME,
          Item: {
            id: 1,
            pendingEntries: items.map(item => ({ ...item, _id: item._id + "" }))
          },
          ConditionExpression: "id <> :idKeyVal",
          ExpressionAttributeValues: {
            ":idKeyVal": 1
          }
        })
        .promise()
        .catch(err => {});
    }

    return corsResponse({ success: true });
  } catch (err) {
    return corsResponse({ success: false, err });
  }
};

const __sandbox = async event => {
  try {
    const mongoDb = await getDbConnection();
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

export const lookupBooks = async event => {
  try {
    const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
    const mongoDb = await getDbConnection();

    const params = {
      TableName: SCAN_STATE_TABLE_NAME,
      Key: { id: 1 }
    };
    const result = await dynamoDb.get(params).promise();
    if (!result?.Item?.pendingEntries?.length) {
      return corsResponse({ success: true, empty: true });
    }

    const pendingEntries = result.Item.pendingEntries;
    const itemLookup = pendingEntries.reduce((hash, entry) => ((hash[entry.isbn] = entry), hash), {});
    const secrets = await getSecrets();
    const isbnDbKey = secrets["isbn-db-key"];

    const isbnDbResponse = await fetch(`https://api2.isbndb.com/books`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: isbnDbKey
      },
      body: `isbns=${pendingEntries.map(entry => entry.isbn).join(",")}`
    });
    const json = await isbnDbResponse.json();

    const newBooks = [];
    for (const item of json.data) {
      newBooks.push(getBookFromIsbnDbModel(item));
    }
    await mongoDb.collection("books").insertMany(newBooks);

    return corsResponse({ success: true });
  } catch (err) {
    return corsResponse({ success: false, err });
  }
};

function getBookFromIsbnDbModel(book) {
  const response = {
    title: book.title || book.title_long,
    isbn: book.isbn13 || book.isbn,
    ean: "",
    pages: book.pages,
    smallImage: book.image,
    mediumImage: book.image,
    publicationDate: book.date_published, // TODO
    publisher: book.publisher,
    authors: book.authors,
    editorialReviews: [],
    subjects: [],
    userId: "" // TODO:
  };

  if (book.synopsys) {
    response.editorialReviews.push({
      source: "synopsys",
      content: book.synopsys
    });
  }

  if (book.overview) {
    response.editorialReviews.push({
      source: "overview",
      content: book.overview
    });
  }

  return response;
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
