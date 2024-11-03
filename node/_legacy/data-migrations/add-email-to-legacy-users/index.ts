import { DynamoDB, type ScanCommandInput, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Client } from "@planetscale/database";

require("dotenv").config();

export const mySqlConnectionFactory = new Client({
  url: process.env.MYSQL_CONNECTION_STRING
});

const AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
const AMAZON_SECRET_KEY = process.env.AMAZON_SECRET_KEY;

const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: AMAZON_ACCESS_KEY,
    secretAccessKey: AMAZON_SECRET_KEY
  },

  region: "us-east-1"
};
const conn = mySqlConnectionFactory.connection();

const TABLE_NAME = "My_Library_dev";
const LIMIT = 50;

const dynamo = DynamoDBDocument.from(new DynamoDB(dynamoConfig));

const scanInput: ScanCommandInput = {
  TableName: TABLE_NAME,
  Limit: LIMIT
};

const lookup = await getUnsyncdUsers();

console.log("Looking for", lookup.size);
console.log([...lookup.values()].join(", "));

let i = 1;
let lastKey = undefined;

do {
  const results = await getNext(lastKey);
  lastKey = results.LastEvaluatedKey;

  for (const item of results.Items) {
    console.log(i++, item.pk);

    if (item.pk.startsWith("User#")) {
      const { userId, email } = item;

      if (userId && email && lookup.has(userId)) {
        await updateUser(userId, email);
      }
    }
  }
} while (lastKey);

async function getNext(lastKey: Record<string, string> | undefined) {
  await new Promise(res => setTimeout(res, 1000));
  return dynamo.scan({ ...scanInput, ExclusiveStartKey: lastKey });
}

async function getUnsyncdUsers() {
  try {
    const result = await executeSQLRaw(
      `
      SELECT userId 
      FROM user_info_cache
      WHERE (email IS NULL OR email = '') AND provider = 'Legacy'
      `,
      []
    );

    return new Set(result.rows.map(r => r.userId));
  } catch (er) {
    console.log("Error updating user", er);
  }
}

async function updateUser(userId: string, email: string) {
  try {
    await executeSQLRaw(
      `
      UPDATE user_info_cache
      SET email = ?
      WHERE userId = ? AND provider = 'Legacy'
      `,
      [email, userId]
    );
  } catch (er) {
    console.log("Error updating user", er);
  }
}

async function executeSQLRaw(sql: string, args: any[] = []) {
  await new Promise(res => setTimeout(res, 150));
  const result = await conn.execute(sql, args);

  console.log("Size --->", result.rowsAffected, "\n");

  return result;
}
