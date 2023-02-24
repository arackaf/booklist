const dotenv = require("dotenv");
dotenv.config();

const TEST_USER_ID = "test-user1";

const insertBook = require("./insert-book");
const insertBookSubject = require("./insert-book-subject");
const insertSubject = require("./insert-subject");
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

  console.log("\nStarting\n");

  try {
    const allSubjects = adjustUserForItems(
      await db
        .collection("subjects")
        .aggregate([{ $limit: 10 }])
        .toArray()
    );

    let i = 1;
    for (const subject of allSubjects) {
      const newId = await insertSubject(subject);
      subjectsLookup[subject._id] = newId;

      console.log("Subject", i++, "of", allSubjects.length, subject.name, "created");
    }
    console.log("\nSubjects done\n");

    const books = adjustUserForItems(
      await db
        .collection("books")
        .aggregate([{ $limit: 100 }])
        .toArray()
    );

    i = 1;
    for (const book of books) {
      const bookId = await insertBook(book);

      console.log("Book", i++, "of", books.length, book.title, "created");

      for (const subject of book?.subjects ?? []) {
        const subjectId = subjectsLookup[subject];
        if (subjectId) {
          await insertBookSubject(bookId, subjectId);
          console.log("Subject", subjectId, "added");
        }
      }
    }

    console.log("\n\nDONE\n\n");
  } catch (er) {
    console.log(er);
  } finally {
    client?.close();
    mySqlConnection?.end();
  }
}

run();
