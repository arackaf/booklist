const dotenv = require("dotenv");
dotenv.config();

const primaryUser = process.env.PRIMARY_USER;
const userIdToSkip = process.env.REPLICANT_USER;

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

async function getLastId() {
  const lastId = await query("SELECT LAST_INSERT_ID() as id");
  return lastId[0].id;
}

const bookFields = [
  "userId",
  "title",
  "isbn",
  "pages",
  "mobileImage",
  "mobileImagePreview",
  "smallImage",
  "smallImagePreview",
  "mediumImage",
  "mediumImagePreview",
  "publicationDate",
  "publisher",
  "editorialReviews"
];

async function insertBook(book) {
  await query(`INSERT INTO books (${bookFields.join(", ")}) VALUES (${bookFields.map(() => "?").join(", ")})`, [
    book.userId,
    book.title,
    book.isbn,
    book.pages,
    book.mobileImage,
    JSON.stringify(book.mobileImagePreview),
    book.smallImage,
    JSON.stringify(book.smallImagePreview),
    book.mediumImage,
    JSON.stringify(book.mediumImagePreview),
    book.publicationDate,
    book.publisher,
    JSON.stringify(book.editorialReviews)
  ]);

  const lastId = await getLastId();
  console.log("Book inserted", lastId);
}

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
