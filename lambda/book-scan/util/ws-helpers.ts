import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { fromUtf8 } from "@aws-sdk/util-utf8-node";

import { db, getQueryPacket } from "./dynamoHelpers";

export const getWsSessionKey = connectionId => `WebSocketScanSession#${connectionId}`;

export class WebSocketMessenger {
  #apiGatewayManagementApi: ApiGatewayManagementApi;

  constructor(endpoint: string) {
    this.#apiGatewayManagementApi = new ApiGatewayManagementApi({
      region: "us-east-1",
      endpoint
    });
  }

  postMessage(connectionId: string, message: object) {
    return this.#apiGatewayManagementApi.postToConnection({ ConnectionId: connectionId, Data: fromUtf8(JSON.stringify(message)) });
  }
}

export async function sendWsMessageToUser(userId, message) {
  const wsSubscriptions = await db.query(
    getQueryPacket(` gsiUserWebSocketLookupPk = :userId `, {
      IndexName: "gsiUserWebSocketLookup",
      ExpressionAttributeValues: { ":userId": userId }
    })
  );
  console.log("Subscriptions found for user", userId, JSON.stringify(wsSubscriptions));

  for (let item of wsSubscriptions) {
    const messenger = new WebSocketMessenger("https://" + item.endpoint);
    const connectionId = item["connection-id"];

    console.log("POSTING", { connectionId, endpoint: item.endpoint });
    try {
      await messenger.postMessage(connectionId, message);
    } catch (er) {
      console.log("Error posting", er);
    }
  }
}
