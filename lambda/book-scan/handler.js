"use strict";

import AWS from "aws-sdk";
import corsResponse from "../util/corsResponse";
import getDbConnection from "../util/getDbConnection";

export const scanBook = async event => {
  try {
    console.log(process.env.stage);
    const db = await getDbConnection();

    await db.collection("pendingEntries").insertOne({ isbn: "Hello World" });

    return corsResponse({ success: true, x: process.env.stage });
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
