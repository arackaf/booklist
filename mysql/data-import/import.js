const dotenv = require("dotenv");
dotenv.config();

const TEST_USER_ID = "test-user1";

const insertBook = require("./insert-book");
const { mySqlConnection } = require("./db-utils");

const primaryUser = process.env.PRIMARY_USER;
const userIdToSkip = process.env.REPLICANT_USER;

const { MongoClient } = require("mongodb");

const subjectsLookup = {};

function adjustUserForItems(items) {
  items = items.filter(item => item.userId !== userIdToSkip);
  items.forEach(item => {
    if (item.userId === primaryUser) {
      item.userId = TEST_USER_ID;
    }
  });

  return items;
}

async function run() {
  const client = await MongoClient.connect(process.env.MONGO_CONNECTION_LIVE);
  const db = await client.db(process.env.DB_NAME);

  try {
    const allSubjects = adjustUserForItems(await db.collection("subjects").find({}).toArray());

    const books = adjustUserForItems(
      await db
        .collection("books")
        .aggregate([{ $limit: 10 }])
        .toArray()
    );

    for (const book of books) {
      if (book.userId === primaryUser) {
        console.log("Primary user book");
        book.userId = TEST_USER_ID;
      } else if (book.userId === userIdToSkip) {
        console.log("Skipping replicant book");
        continue;
      }

      await insertBook(book);
    }

    console.log({ books: books.length });
  } catch (er) {
    console.log(er);
  } finally {
    client?.close();
    mySqlConnection?.end();
  }
}

run();
