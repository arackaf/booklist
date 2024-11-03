const dotenv = require("dotenv");
dotenv.config();

const { query } = require("./db-utils");

const TEST_USER_ID = "test-user1";

const insertBook = require("./insert-book");
const insertBookSubject = require("./insert-book-subject");
const insertBookTag = require("./insert-book-tag");
const insertSubject = require("./insert-subject");
const insertTag = require("./insert-tag");
const { mySqlConnection } = require("./db-utils");

const primaryUser = process.env.PRIMARY_USER;
const userIdToSkip = process.env.REPLICANT_USER;

const { MongoClient } = require("mongodb");

async function run() {
  const client = await MongoClient.connect(process.env.MONGO_CONNECTION_LIVE);
  const db = await client.db(process.env.DB_NAME);

  console.log("\nStarting\n");

  const x = await query("SELECT COUNT(*) FROM tags");
  console.log({ x });

  try {
    console.log("\n\nDONE\n\n");
  } catch (er) {
    console.log(er);
  } finally {
    client?.close();
    mySqlConnection?.end();
  }
}

run();
