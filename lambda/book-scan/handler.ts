"use strict";

import AWS from "aws-sdk";

import corsResponse from "../util/corsResponse";
import getDbConnection from "../util/getDbConnection";

export const scanBook = async event => {
  try {
    const db = await getDbConnection();
    const { isbn } = JSON.parse(event.body);

    await db.collection("pendingEntries").insertOne({ isbn });

    const dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: "us-east-1"
    });

    const TABLE_NAME = `my_library_scan_state_${process.env.stage}`;

    const params = {
      TableName: TABLE_NAME,
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

    const x = await dynamoDb.get({ TableName: TABLE_NAME, Key: { id: 1 } }).promise();

    await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key: { id: 2 },
        UpdateExpression: "set loginKey = :login",
        ExpressionAttributeValues: { ":login": "abc123" }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key: { id: 3 },
        UpdateExpression: "set loginKey = :login",
        ExpressionAttributeValues: { ":login": "abc123" }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key: { id: 4 },
        UpdateExpression: "ADD notificationPaths :newPath",
        ExpressionAttributeValues: { ":newPath": dynamoDb.createSet(["path-yo"]) }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key: { id: 4 },
        UpdateExpression: "ADD notificationPaths :newPath SET aaa = :list",
        ExpressionAttributeValues: { ":newPath": dynamoDb.createSet(["path-yo-2"]), ":list": ["f", "g"] }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key: { id: 4 },
        UpdateExpression: "SET aaa = :list DELETE notificationPaths :oldPath",
        ExpressionAttributeValues: { ":list": ["f", "g"], ":oldPath": dynamoDb.createSet(["path-yo"]) }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: TABLE_NAME,
        Key: { id: 66 },
        UpdateExpression: "SET myset = :set",
        ExpressionAttributeValues: { ":set": dynamoDb.createSet(["a", "b", "c"]) }
      })
      .promise();

    await dynamoDb
      .update({
        TableName: TABLE_NAME,
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

export const hello = async event => {
  console.log("CALLED YO", +new Date());

  try {
    const db = new AWS.DynamoDB({
      region: "us-east-1"
    });

    const params = {
      TableName: "my_library_scan_state_live",
      Key: {
        id: { N: "1" }
      }
    };
    const result = await db.getItem(params).promise();
    console.log("FOUND", result.Item);
    console.log("FOUND", JSON.stringify(result.Item));
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
