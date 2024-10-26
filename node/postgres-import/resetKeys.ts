require("dotenv").config();

import pg from "pg";
import { Client } from "@planetscale/database";

const { Client: PgClient } = pg;

const pgClient = new PgClient({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  database: "my-library"
});

export async function fixTable(table: string, key = "id") {
  const sequenceNameResult = await pgClient.query(`SELECT pg_get_serial_sequence('${table}', '${key}') seq;`);
  const sequenceName = sequenceNameResult.rows[0].seq;

  const maxKeyResult = await pgClient.query(`SELECT MAX(${key}) max FROM ${table};`);
  const maxKey = maxKeyResult.rows[0].max;

  await pgClient.query(`SELECT setval('${sequenceName}', ${maxKey});`);
  console.log(`SELECT setval('${sequenceName}', ${maxKey});`);
}

async function migrate() {
  await pgClient.connect();

  try {
    await fixTable("books");

    await fixTable("books_subjects");
    await fixTable("books_tags");
    await fixTable("similar_books");

    await fixTable("subjects");
    await fixTable("tags");
  } finally {
    pgClient.end();
  }
}

migrate();
