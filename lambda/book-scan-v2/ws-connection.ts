import { fromUtf8 } from "@aws-sdk/util-utf8";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";

import { getWsSessionKey } from "./util/ws-helpers";
import { db, getGetPacket, getUpdatePacket, TABLE_NAME, dynamo } from "../util/dynamoHelpers";

export const connect = async event => {
  const connectionId = event.requestContext.connectionId;
  const key = getWsSessionKey(connectionId);

  try {
    const timestamp = +new Date();

    await dynamo.put({
      TableName: TABLE_NAME,
      Item: {
        pk: key,
        sk: key,
        "connection-id": connectionId,
        timestamp,
        expires: Math.round(timestamp / 1000) + 60 * 60 * 24 * 7, // 1 week
        endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
      }
    });
  } catch (er) {
    console.log("ERROR", er);
  }

  return {
    statusCode: 200
  };
};

export const sync = async event => {
  try {
    const packet = JSON.parse(event.body);
    const messenger = new ApiGatewayManagementApi({
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
        UpdateExpression: "SET userId = :userId, gsiUserWebSocketLookupPk = :userId",
        ExpressionAttributeValues: { ":userId": packet.userId }
      })
    );

    await new Promise(res => {
      messenger.postToConnection(
        { ConnectionId: event.requestContext.connectionId, Data: fromUtf8(JSON.stringify({ message: "Connected and listening ..." })) },
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

export const disconnect = async event => {
  const connectionId = event.requestContext.connectionId;
  const key = getWsSessionKey(connectionId);

  await dynamo.delete({ TableName: TABLE_NAME, Key: { pk: key, sk: key } });

  return {
    statusCode: 200
  };
};
