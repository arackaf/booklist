const dotenv = require("dotenv");
dotenv.config();

const mysql = require("mysql");

const { MongoClient } = require("mongodb");

//const mySqlConnection = mysql.createConnection(process.env.MYSQL);
const mySqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  ssl: {
    rejectUnauthorized: false
  }
});
mySqlConnection.connect();

function query(...args) {
  return new Promise((res, rej) => {
    mySqlConnection.query(...args, (err, results) => {
      if (err) {
        rej(err);
      } else {
        res(results);
      }
    });
  });
}

async function insertBook(book) {
  try {
    await query("INSERT INTO books (title, isbn, pages) VALUES (?, ?, ?)", [book.title, book.isbn, book.pages]);
    console.log("Book inserted");
  } catch (err) {
    console.log("Error inserting book", err);
  }
}

const userIdToSkip = process.env.REPLICANT_USER;

async function run() {
  const client = await MongoClient.connect(process.env.MONGO_CONNECTION_LIVE);
  const db = await client.db(process.env.DB_NAME);

  // mySqlConnection.query("SELECT * FROM subjects", (err, results, fields) => {
  //   console.log({ err, results, fields });
  // });

  try {
    const books = await db
      .collection("books")
      .aggregate([{ $limit: 50 }])
      .toArray();

    for (const book of books) {
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
