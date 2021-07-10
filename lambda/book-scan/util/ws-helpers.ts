import AWS from "aws-sdk";

import { db, getQueryPacket } from "../../util/dynamoHelpers";

export async function sendWsMessageToUser(userId, message) {
  const wsSubscriptions = await db.query(
    getQueryPacket(` gsiUserWebSocketLookupPk = :userId `, {
      IndexName: "gsiUserWebSocketLookup",
      ExpressionAttributeValues: { ":userId": userId }
    })
  );
  console.log("Subscriptions found for user", userId, JSON.stringify(wsSubscriptions));

  for (let item of wsSubscriptions) {
    const messenger = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: item.endpoint
    });
    const connectionId = item["connection-id"];

    console.log("POSTING", { connectionId, endpoint: item.endpoint });
    await messenger.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(message) }).promise();
  }
}
