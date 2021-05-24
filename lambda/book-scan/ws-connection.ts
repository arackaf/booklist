import AWS from "aws-sdk";

const WS_STATE_TABLE_NAME = `my_library_ws_state_state_${process.env.stage}`;

export const connect = async event => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  const connectionId = event.requestContext.connectionId;
  console.log("CONNECT:", connectionId);

  try {
    await dynamoDb
      .put({
        TableName: WS_STATE_TABLE_NAME,
        Item: { "connection-id": connectionId, userId: "tbd" }
      })
      .promise()
      .catch(err => {
        console.log("Dynamo Error", err);
      });
  } catch (er) {
    console.log("ERROR", er);
  }

  return {
    statusCode: 200
  };
};

export const disconnect = async event => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  const connectionId = event.requestContext.connectionId;
  console.log("DIS-CONNECT:", connectionId);

  await dynamoDb
    .delete({
      TableName: WS_STATE_TABLE_NAME,
      Key: { "connection-id": connectionId }
    })
    .promise()
    .then(() => {
      console.log("DONE", connectionId);
    })
    .catch(err => {
      console.log("ERROR", err);
    });

  return {
    statusCode: 200
  };
};
