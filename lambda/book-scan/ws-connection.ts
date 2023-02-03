import { fromUtf8 } from "@aws-sdk/util-utf8-node";
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

    const connectionId = event.requestContext.connectionId;
    const endpoint = "https://" + event.requestContext.domainName + "/" + event.requestContext.stage;
    console.log("Creating apiGateway instance", endpoint);

    const messenger = new ApiGatewayManagementApi({
      region: "us-east-1",
      endpoint
    });

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
        { ConnectionId: connectionId, Data: fromUtf8(JSON.stringify({ message: "Connected and listening ..." })) },
        (err, data) => {
          res({});
          console.log("CALLBACK ERROR", err, "DATA", data);
        }
      );
    });
  } catch (er) {
    console.log("ERROR in sync", er);
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
