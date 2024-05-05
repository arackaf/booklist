import { DynamoDB, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import type {
  PutCommandInput,
  GetCommandInput,
  QueryCommandInput,
  UpdateCommandInput,
  DeleteCommandInput,
  TransactWriteCommandInput
} from "@aws-sdk/lib-dynamodb";

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
export const getDeletePacket = (key): DeleteCommandInput => ({ TableName: TABLE_NAME, Key: key });

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

  async transactWrite(packet: TransactWriteCommandInput, attempts = 5) {
    console.log("ATTEMPTING TRANSACTION", JSON.stringify(packet));
    try {
      const result = await attemptExecution(attempts, () => dynamo.transactWrite(packet));
      console.log("TRANSACTION SUCCESS");
    } catch (err) {
      console.log("TRANSACTION FAILED", err);
      throw err;
    }
  },

  async deleteItem(pk: string, sk: string) {
    return dynamo.delete({ TableName: TABLE_NAME, Key: { pk, sk } });
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
