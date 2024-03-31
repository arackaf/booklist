import { DynamoDB, type ScanCommandInput, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Client, type Transaction, type ExecutedQuery, type Connection } from "@planetscale/database";

require("dotenv").config();

export const mySqlConnectionFactory = new Client({
  url: process.env.MYSQL_CONNECTION_STRING
});

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

    if (item.pk.startsWith("User#")) {
      const { userId, email } = item;

      if (userId && email) {
        await updateUser(userId, email);
      }
    }
  }
} while (lastKey);

async function getNext(lastKey: Record<string, string> | undefined) {
  return dynamo.scan({ ...scanInput, ExclusiveStartKey: lastKey });
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
  const conn = mySqlConnectionFactory.connection();
  const result = await conn.execute(sql, args);

  console.log("Size --->", result.rowsAffected, "\n");
}
