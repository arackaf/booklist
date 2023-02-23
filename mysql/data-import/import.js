const dotenv = require("dotenv");
dotenv.config();

const insertBook = require("./insert-book");
const { mySqlConnection } = require("./db-utils");

const primaryUser = process.env.PRIMARY_USER;
const userIdToSkip = process.env.REPLICANT_USER;

const { MongoClient } = require("mongodb");

//const mySqlConnection = mysql.createConnection(process.env.MYSQL);

async function run() {
  const client = await MongoClient.connect(process.env.MONGO_CONNECTION_LIVE);
  const db = await client.db(process.env.DB_NAME);

  // mySqlConnection.query("SELECT * FROM subjects", (err, results, fields) => {
  //   console.log({ err, results, fields });
  // });

  try {
    const books = await db
      .collection("books")
      .aggregate([{ $limit: 10 }])
      .toArray();

    for (const book of books) {
      if (book.userId === primaryUser) {
        console.log("Primary user book");
        book.userId = "test-user1";
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
