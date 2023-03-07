import dotenv from "dotenv";
dotenv.config();

import { Client } from "@planetscale/database";
import fetch from "node-fetch";
(global as any).fetch = fetch;

const mySqlConnectionFactory = new Client({
  url: process.env.MYSQL_CONNECTION_STRING
});
const conn = mySqlConnectionFactory.connection();

const pause = () => new Promise(res => setTimeout(res, 3000));

async function run() {
  try {
    const resp = await conn.execute("SELECT * FROM books WHERE char_length(isbn) = 10 OR char_length(isbn) = 13 ORDER BY ID desc");
    const books = resp.rows;

    console.log(books.length);
    const nextBatch: any[] = [];
    let i = 1;
    for (const book of books) {
      nextBatch.push(book);
      i++;

      if (nextBatch.length === 20) {
        await runBatch(nextBatch);
        nextBatch.length = 0;

        console.log("\n", i, "books done\n");
        await pause();
      }
    }
    console.log("END LOOP");

    if (nextBatch.length) {
      await runBatch(nextBatch);
    }
  } catch (er) {
    console.log("Error", er);
  }
}

async function runBatch(books: any[]) {
  const isbns = [...new Set(books.map(entry => entry.isbn))].join(",");

  const isbnDbResponse = await fetch(`https://api2.isbndb.com/books`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: process.env.ISBN_DB_KEY
    },
    body: `isbns=${isbns}`
  });
  const booksResp = ((await isbnDbResponse.json()) as any).data;

  for (const book of booksResp) {
    const editorialReviews = [];
    if (book.synopsys) {
      editorialReviews.push({
        source: "Synopsys",
        content: book.synopsys
      });
    }
    if (book.synopsis) {
      editorialReviews.push({
        source: "Synopsis",
        content: book.synopsis
      });
    }

    if (book.overview) {
      editorialReviews.push({
        source: "Overview",
        content: book.overview
      });
    }

    if (editorialReviews.length) {
      for (const existingBook of books) {
        if (existingBook.isbn === book.isbn || existingBook.isbn === book.isbn10 || existingBook.isbn === book.isbn13) {
          await conn.execute("UPDATE books SET editorialReviews = ? WHERE id = ?", [JSON.stringify(editorialReviews), existingBook.id]);
          console.log(existingBook.title, "UPDATED");
        }
      }
    }
  }
}

run();
