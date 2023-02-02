import AWS from "aws-sdk";

import { BOOKLIST_DYNAMO, AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY } from "$env/static/private";

type GetItemInput = AWS.DynamoDB.DocumentClient.GetItemInput;
type UpdateItemInput = AWS.DynamoDB.DocumentClient.UpdateItemInput;
type PutItemInput = AWS.DynamoDB.DocumentClient.PutItemInput;
type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;
type TransactWriteItemsInput = AWS.DynamoDB.DocumentClient.TransactWriteItemsInput;

export const TABLE_NAME = BOOKLIST_DYNAMO;

export const getGetPacket = (pk: string, sk: string, rest: object = {}): GetItemInput => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });
export const getQueryPacket = (keyExpression: string, rest = {}) => ({
  TableName: TABLE_NAME,
  KeyConditionExpression: keyExpression,
  ...rest
});
export const getPutPacket = (obj: object, rest = {}) => ({ TableName: TABLE_NAME, Item: obj, ...rest });
export const getUpdatePacket = (pk: string, sk: string, rest: object) => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: AMAZON_ACCESS_KEY,
    secretAccessKey: AMAZON_SECRET_KEY
  }
});

export { dynamo };

export const db = {
  async put(packet: PutItemInput) {
    await dynamo.put(packet).promise();
  },

  async get(packet: GetItemInput) {
    let result = await dynamo.get(packet).promise();
    return result.Item || null;
  },

  async query(packet: QueryInput) {
    let res = await dynamo.query(packet).promise();

    return res?.Items ?? [];
  },

  async queryOne(packet: QueryInput) {
    let res = await dynamo.query(packet).promise();

    if (!res || !res.Items || !res.Items[0]) {
      return null;
    }

    return res.Items[0];
  },

  async pagedQuery(packet: QueryInput) {
    let result = await dynamo.query(packet).promise();

    return { items: result.Items || null, lastEvaluatedKey: result.LastEvaluatedKey };
  },

  async update(packet: UpdateItemInput) {
    return dynamo.update(packet).promise();
  },

  async transactWrite(packet: TransactWriteItemsInput) {
    return dynamo.transactWrite(packet).promise();
  },

  async deleteItem(pk: string, sk: string) {
    return dynamo.delete({ TableName: TABLE_NAME, Key: { pk, sk } }).promise();
  }
};
