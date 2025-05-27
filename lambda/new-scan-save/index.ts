import { config } from "dotenv";
import pg from "pg";

import { DynamoDB, DynamoDBClientConfig, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DeleteCommandInput, DynamoDBDocument, GetCommandInput } from "@aws-sdk/lib-dynamodb";

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import * as schema from "./drizzle/drizzle-schema";

config({ path: ".env.local" });

const AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
const AMAZON_SECRET_KEY = process.env.AMAZON_SECRET_KEY;
const POSTGRES_CONNECTION_STRING = process.env.FLY_DB;
const TABLE_NAME = process.env.DYNAMO_TABLE;

const newScansPk = "#NewBookScanned";

export const getGetPacket = (pk: string, sk: string, rest: object = {}): GetCommandInput => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });

export const getQueryPacket = (keyExpression: string, rest = {}): QueryCommandInput => ({
  TableName: TABLE_NAME,
  KeyConditionExpression: keyExpression,
  ...rest
});

export const getDeletePacket = (key): DeleteCommandInput => ({ TableName: TABLE_NAME, Key: key });

const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: AMAZON_ACCESS_KEY,
    secretAccessKey: AMAZON_SECRET_KEY
  },

  region: "us-east-1"
};

const dynamo = DynamoDBDocument.from(new DynamoDB(dynamoConfig));

async function readNewScans() {
  const packet = getQueryPacket(` pk = :pk `, {
    ExpressionAttributeValues: { ":pk": newScansPk },
    Limit: 100
  });

  const result = await dynamo.query(packet);
  return result.Items;
}

export function initializePostgres() {
  const { Pool } = pg;

  const pool = new Pool({
    connectionString: POSTGRES_CONNECTION_STRING
  });

  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  return drizzlePg({ schema, client: pool });
}

async function sync() {
  let db = initializePostgres();
  const pendingBooks = await readNewScans();

  for (const bookPacket of pendingBooks) {
    const book = JSON.parse(bookPacket.book) as typeof schema.books.$inferSelect;
    book.dateAdded = new Date(book.dateAdded);

    console.log("Found book", book.title);

    await db.insert(schema.books).values(book);
    await dynamo.delete(getDeletePacket({ pk: bookPacket.pk, sk: bookPacket.sk }));
  }
}

sync();
