"use strict";

import AWS from "aws-sdk";

import { getPendingCount, getStatusCountUpdate } from "./util/data-helpers";
import { getScanItemKey } from "./util/key-helpers";
import { sendWsMessageToUser } from "./util/ws-helpers";
import { getWsSessionKey } from "./util/ws-helpers";

import checkLogin from "../util/checkLoginToken";
import corsResponse from "../util/corsResponse";
import { db, getGetPacket, getPutPacket, getUpdatePacket, TABLE_NAME } from "../util/dynamoHelpers";
import { runBookLookupIfAble } from "./util/book-lookup";

const SCAN_STATE_TABLE_NAME = "";

export const sync = async event => {
  try {
    const packet = JSON.parse(event.body);
    const messenger = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
    });
    const connectionId = event.requestContext.connectionId;

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
      return corsResponse({ success: false, badLogin: true });
    }

    const [pk, sk] = getScanItemKey();

    await db.transactWrite({
      TransactItems: [
        {
          Put: getPutPacket({ pk, sk, isbn, userId })
        },
        {
          Update: getStatusCountUpdate(userId, 1)
        }
      ]
    });

    const pendingCount = await getPendingCount(userId, true);
    await sendWsMessageToUser(userId, { type: "bookQueued", pendingCount });

    return corsResponse({ success: true, pendingCount });
  } catch (err) {
    console.log("ERROR", err);

    return corsResponse({ success: false, err });
  }
};

export const streamHandler = async event => {
  try {
    const userNotifications = notifyUserScanStatusUpdates(event);
    const lookup = runBookLookupIfAble();

    await Promise.all([userNotifications, lookup]);
  } catch (er) {
    console.log("ERROR in stream handler", er);
  }
};

const getNewDynamoRecordsFromEvent = event => {
  const records = event.Records || [];
  const result = [];
  for (const record of records) {
    const newImage = record?.dynamodb?.NewImage;
    if (newImage) {
      result.push(newImage);
    }
  }
  return result;
};

const notifyUserScanStatusUpdates = async event => {
  const usersScanned = new Set<string>([]);

  for (const newImage of getNewDynamoRecordsFromEvent(event)) {
    const pk = newImage.pk.S;

    if (pk.startsWith("UserScanStatus")) {
      const userId = pk.split("#")[1];
      usersScanned.add(userId);
    }
  }
  const notifyAllUsers = [...usersScanned].map(userId =>
    Promise.resolve(getPendingCount(userId).then(pendingCount => sendWsMessageToUser(userId, { type: "bookQueued", pendingCount })))
  );

  return Promise.all(notifyAllUsers);
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
