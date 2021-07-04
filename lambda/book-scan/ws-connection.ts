import AWS from "aws-sdk";

import { TABLE_NAME } from "../util/dynamoHelpers";
import { getKey } from "./ws-helpers";

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

export const connect = async event => {
  const connectionId = event.requestContext.connectionId;
  const key = getKey(connectionId);

  try {
    await dynamoDb
      .put({
        TableName: TABLE_NAME,
        Item: { pk: key, sk: key, "connection-id": connectionId, userId: "pending ..." }
      })
      .promise();
  } catch (er) {
    console.log("ERROR", er);
  }

  return {
    statusCode: 200
  };
};

export const disconnect = async event => {
  const connectionId = event.requestContext.connectionId;
  const key = getKey(connectionId);

  await dynamoDb.delete({ TableName: TABLE_NAME, Key: { pk: key, sk: key } }).promise();

  return {
    statusCode: 200
  };
};
