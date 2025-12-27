import { DynamoDB, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import type { PutCommandInput, GetCommandInput, QueryCommandInput, UpdateCommandInput, TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb";

// @ts-ignore
export const TABLE_NAME = `My_Library_${process.env.STAGE || "live"}`;

export const getGetPacket = (pk, sk, rest = {}): GetCommandInput => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });
export const getQueryPacket = (keyExpression, rest = {}): QueryCommandInput => ({
  TableName: TABLE_NAME,
  KeyConditionExpression: keyExpression,
  ...rest
});

type MultiPurposeUpdateCommand = Omit<UpdateCommandInput, "UpdateExpression"> & {
  UpdateExpression: string;
};

export const getPutPacket = (obj, rest = {}): PutCommandInput => ({ TableName: TABLE_NAME, Item: obj, ...rest });
export const getUpdatePacket = (pk, sk, rest): MultiPurposeUpdateCommand => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });

const dynamoConfig: DynamoDBClientConfig = {
  region: "us-east-1"
};

export const dynamo = DynamoDBDocument.from(new DynamoDB(dynamoConfig));

const wait = ms => new Promise(res => setTimeout(res, ms));

export const db = {
  async put(packet: PutCommandInput) {
    return dynamo.put(packet);
  },

  async get(packet: GetCommandInput) {
    let result = await dynamo.get(packet);
    return result.Item || null;
  },

  async query(packet: QueryCommandInput) {
    let res = await dynamo.query(packet);

    if (!res || !res.Items) {
      return [];
    }

    return res.Items;
  },

  async queryOne(packet: QueryCommandInput) {
    let res = await dynamo.query(packet);

    if (!res || !res.Items || !res.Items[0]) {
      return null;
    }

    return res.Items[0];
  },

  async update(packet: UpdateCommandInput) {
    return dynamo.update(packet);
  },

  async deleteItem(pk: string, sk: string) {
    return dynamo.delete({ TableName: TABLE_NAME, Key: { pk, sk } });
  }
};
