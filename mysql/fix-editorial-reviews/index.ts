import dotenv from "dotenv";
dotenv.config();

import { Client } from "@planetscale/database";
import fetch from "node-fetch";

const mySqlConnectionFactory = new Client({
  url: process.env.MYSQL_CONNECTION_STRING
});
const conn = mySqlConnectionFactory.connection();

async function run() {
  try {
    const resp = await conn.execute("SELECT * FROM books WHERE char_length(isbn) = 10 OR char_length(isbn) = 13");
    const books = resp.rows;
    console.log(books.length);
  } catch (er) {
    console.log("Error", er);
  }
  console.log(fetch);
}

run();
