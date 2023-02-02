import { env } from "$env/dynamic/private";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";

import { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY } from "$env/static/private";

export const TABLE_NAME = env.BOOKLIST_DYNAMO;

export const getGetPacket = (pk, sk, rest = {}) => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });
export const getQueryPacket = (keyExpression, rest = {}) => ({
  TableName: TABLE_NAME,
  KeyConditionExpression: keyExpression,
  ...rest
});
export const getPutPacket = (obj, rest = {}) => ({ TableName: TABLE_NAME, Item: obj, ...rest });
export const getUpdatePacket = (pk, sk, rest) => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });

const dynamoConfig = {
  credentials: {
    accessKeyId: AMAZON_ACCESS_KEY,
    secretAccessKey: AMAZON_SECRET_KEY
  },

  region: "us-east-1"
};

const dynamo = DynamoDBDocument.from(new DynamoDB(dynamoConfig), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true
  }
});

export { dynamo };

export const db = {
  async put(packet) {
    await dynamo.put(packet).promise();
  },

  async get(packet) {
    let result = await dynamo.get(packet).promise();
    return result.Item || null;
  },

  async query(packet) {
    let res = await dynamo.query(packet).promise();

    return res?.Items ?? [];
  },

  async queryOne(packet) {
    let res = await dynamo.query(packet).promise();

    if (!res || !res.Items || !res.Items[0]) {
      return null;
    }

    return res.Items[0];
  },

  async pagedQuery(packet) {
    let result = await dynamo.query(packet).promise();

    return { items: result.Items || null, lastEvaluatedKey: result.LastEvaluatedKey };
  },

  async update(packet) {
    return dynamo.update(packet).promise();
  },

  async transactWrite(packet) {
    return dynamo.transactWrite(packet).promise();
  },

  async deleteItem(pk, sk) {
    return dynamo.delete({ TableName: TABLE_NAME, Key: { pk, sk } }).promise();
  }
};
