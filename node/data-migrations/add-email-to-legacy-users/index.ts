import { DynamoDB, type ScanCommandInput, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, ScanCommand } from "@aws-sdk/lib-dynamodb";

require("dotenv").config();

console.log(DynamoDB, DynamoDBDocument);

const AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
const AMAZON_SECRET_KEY = process.env.AMAZON_SECRET_KEY;

const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: AMAZON_ACCESS_KEY,
    secretAccessKey: AMAZON_SECRET_KEY
  },

  region: "us-east-1"
};

const TABLE_NAME = "My_Library_dev";
const LIMIT = 5;

const dynamo = DynamoDBDocument.from(new DynamoDB(dynamoConfig));

const scanInput: ScanCommandInput = {
  TableName: TABLE_NAME,
  Limit: LIMIT
};

let lastKey = undefined;
do {
  const results = await getNext(lastKey);
  lastKey = results.LastEvaluatedKey;

  for (const item of results.Items) {
    console.log(item.pk);
  }
} while (lastKey);

async function getNext(lastKey: Record<string, string> | undefined) {
  return dynamo.scan({ ...scanInput, ExclusiveStartKey: lastKey });
}
