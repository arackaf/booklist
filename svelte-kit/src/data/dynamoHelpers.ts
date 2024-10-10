import { BOOKLIST_DYNAMO, DYNAMO_AUTH_TABLE, AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY } from "$env/static/private";

import { DynamoDB, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import type { PutCommandInput, GetCommandInput, QueryCommandInput, UpdateCommandInput, TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb";

export const TABLE_NAME = BOOKLIST_DYNAMO;

export const getGetPacket = (pk: string, sk: string, rest: object = {}): GetCommandInput => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });
export const getQueryPacket = (keyExpression: string, rest = {}): QueryCommandInput => ({
  TableName: TABLE_NAME,
  KeyConditionExpression: keyExpression,
  ...rest
});
export const getPutPacket = (obj: object, rest = {}): PutCommandInput => ({ TableName: TABLE_NAME, Item: obj, ...rest });
export const getUpdatePacket = (pk: string, sk: string, rest: object): UpdateCommandInput => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });

export const getAuthQueryPacket = (keyExpression: string, rest = {}): QueryCommandInput => ({
  TableName: DYNAMO_AUTH_TABLE,
  KeyConditionExpression: keyExpression,
  ...rest
});

export const getAuthGSI1QueryPacket = (keyExpression: string, rest = {}): QueryCommandInput => ({
  TableName: DYNAMO_AUTH_TABLE,
  IndexName: "GSI1",
  KeyConditionExpression: keyExpression,
  ...rest
});

const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: AMAZON_ACCESS_KEY,
    secretAccessKey: AMAZON_SECRET_KEY
  },

  region: "us-east-1"
};

const dynamo = DynamoDBDocument.from(new DynamoDB(dynamoConfig));

export { dynamo };

export const db = {
  async put(packet: PutCommandInput) {
    await dynamo.put(packet);
  },

  async get(packet: GetCommandInput) {
    let result = await dynamo.get(packet);
    return result.Item || null;
  },

  async query(packet: QueryCommandInput) {
    let res = await dynamo.query(packet);

    return res?.Items ?? [];
  },

  async queryOne(packet: QueryCommandInput) {
    let res = await dynamo.query(packet);

    if (!res || !res.Items || !res.Items[0]) {
      return null;
    }

    return res.Items[0];
  },

  async pagedQuery(packet: QueryCommandInput) {
    let result = await dynamo.query(packet);

    return { items: result.Items || null, lastEvaluatedKey: result.LastEvaluatedKey };
  },

  async update(packet: UpdateCommandInput) {
    return dynamo.update(packet);
  },

  async transactWrite(packet: TransactWriteCommandInput) {
    return dynamo.transactWrite(packet);
  },

  async deleteItem(pk: string, sk: string) {
    return dynamo.delete({ TableName: TABLE_NAME, Key: { pk, sk } });
  }
};
