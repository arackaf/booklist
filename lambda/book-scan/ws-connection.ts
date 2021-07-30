import AWS from "aws-sdk";

import { TABLE_NAME } from "../util/dynamoHelpers";
import { getWsSessionKey } from "./ws-helpers";

import { dynamo } from "../util/dynamoHelpers";

export const connect = async event => {
  const connectionId = event.requestContext.connectionId;
  const key = getWsSessionKey(connectionId);

  try {
    const timestamp = +new Date();

    await dynamo
      .put({
        TableName: TABLE_NAME,
        Item: {
          pk: key,
          sk: key,
          "connection-id": connectionId,
          timestamp,
          expires: Math.round(timestamp / 1000) + 60 * 60 * 24 * 7, // 1 week
          endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
        }
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
  const key = getWsSessionKey(connectionId);

  await dynamo.delete({ TableName: TABLE_NAME, Key: { pk: key, sk: key } }).promise();

  return {
    statusCode: 200
  };
};
