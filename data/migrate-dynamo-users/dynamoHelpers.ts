import { DynamoDB, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import type { PutCommandInput, GetCommandInput, QueryCommandInput, UpdateCommandInput, TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb";

import { ENV } from "./env";

let TABLE_NAME: string;
let AMAZON_ACCESS_KEY: string;
let AMAZON_SECRET_KEY: string;

type InitializeDynamoProps = {
  tableName: string;
  authTableName: string;
  accessKey: string;
  secretKey: string;
};

export function initializeDynamo() {
  const { DYNAMO_TABLE, AWS_ACCESS_KEY, AWS_SECRET_KEY } = ENV;

  TABLE_NAME = DYNAMO_TABLE;
  AMAZON_ACCESS_KEY = AWS_ACCESS_KEY;
  AMAZON_SECRET_KEY = AWS_SECRET_KEY;

  const dynamoConfig: DynamoDBClientConfig = {
    credentials: {
      accessKeyId: AMAZON_ACCESS_KEY,
      secretAccessKey: AMAZON_SECRET_KEY
    },

    region: "us-east-1"
  };

  dynamo = DynamoDBDocument.from(new DynamoDB(dynamoConfig));
}

let dynamo: ReturnType<typeof DynamoDBDocument.from> = null as any;

export async function scanUsers() {
  await initializeDynamo();

  return dynamo.scan({
    TableName: TABLE_NAME,
    FilterExpression: "begins_with(pk, :prefix)",
    ExpressionAttributeValues: {
      ":prefix": "UserId#"
    }
  });
}
