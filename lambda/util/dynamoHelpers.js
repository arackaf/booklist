import AWS from "aws-sdk";

export const TABLE_NAME = `My_Library_${process.env.STAGE}`;

export const getGetPacket = (pk, sk, rest = {}) => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });
export const getQueryPacket = (keyExpression, rest = {}) => ({
  TableName: TABLE_NAME,
  KeyConditionExpression: keyExpression,
  ...rest
});
export const getPutPacket = (obj, rest = {}) => ({ TableName: TABLE_NAME, Item: obj, ...rest });

export const getUpdatePacket = (pk, sk, rest) => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });

export const getDeletePacket = key => ({ TableName: TABLE_NAME, Key: key });

export const dynamo = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1"
});

const wait = ms => new Promise(res => setTimeout(res, ms));

export const db = {
  async put(packet) {
    return dynamo.put(packet).promise();
  },

  async get(packet) {
    let result = await dynamo.get(packet).promise();
    return result.Item || null;
  },

  async query(packet) {
    let res = await dynamo.query(packet).promise();

    if (!res || !res.Items) {
      return [];
    }

    return res.Items;
  },

  async queryOne(packet) {
    let res = await dynamo.query(packet).promise();

    if (!res || !res.Items || !res.Items[0]) {
      return null;
    }

    return res.Items[0];
  },

  async update(packet) {
    return dynamo.update(packet).promise();
  },

  async transactWrite(packet) {
    console.log("ATTEMPTING TRANSACTION", JSON.stringify(packet));
    try {
      const result = await attemptExecution(5, () => dynamo.transactWrite(packet).promise());
      console.log("TRANSACTION SUCCESS");
    } catch (err) {
      console.log("TRANSACTION FAILED", err);
    }
  },

  async deleteItem(pk, sk) {
    return dynamo.delete({ TableName: TABLE_NAME, Key: { pk, sk } }).promise();
  }
};

async function attemptExecution(times, executor) {
  let success;
  let resultOrError;

  for (let i = 1; i <= 5; i++) {
    [success, resultOrError] = await attemptRun(executor);

    if (success) {
      return resultOrError;
    }
    console.log("Failed on attempt:", i, resultOrError);
    await wait(150 * i * Math.random());
  }
  throw resultOrError;
}

async function attemptRun(executor) {
  try {
    const result = await executor();
    return [true, result];
  } catch (err) {
    return [false, err];
  }
}
