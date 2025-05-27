import { getWsSessionKey, WebSocketMessenger } from "./util/ws-helpers";
import { db, getGetPacket, getUpdatePacket, TABLE_NAME, dynamo, getPutPacket } from "./util/dynamoHelpers";

export const connect = async event => {
  const connectionId = event.requestContext.connectionId;
  const key = getWsSessionKey(connectionId);

  try {
    const timestamp = +new Date();

    await dynamo.put(
      getPutPacket({
        pk: key,
        sk: key,
        "connection-id": connectionId,
        timestamp,
        expires: Math.round(timestamp / 1000) + 60 * 60 * 24 * 7, // 1 week
        endpoint: event.requestContext.domainName + "/" + event.requestContext.stage
      })
    );
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

    const messenger = new WebSocketMessenger(endpoint);

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

    await messenger.postMessage(connectionId, { message: "Connected and listening ..." });
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
