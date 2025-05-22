import { config } from "dotenv";

import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, GetCommandInput } from "@aws-sdk/lib-dynamodb";

config({ path: ".env.local" });

const AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
const AMAZON_SECRET_KEY = process.env.AMAZON_SECRET_KEY;
const TABLE_NAME = process.env.DYNAMO_TABLE;

console.log("WORK");

export const getGetPacket = (pk: string, sk: string, rest: object = {}): GetCommandInput => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });

console.log({ AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY });

const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: AMAZON_ACCESS_KEY,
    secretAccessKey: AMAZON_SECRET_KEY
  },

  region: "us-east-1"
};

const dynamo = DynamoDBDocument.from(new DynamoDB(dynamoConfig));

async function foo() {
  const packet = getGetPacket("#SECRETS", "#SECRETS");
  let result = await dynamo.get(packet);
  console.log({ result });
}

foo();
