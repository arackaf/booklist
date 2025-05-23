import { config } from "dotenv";
import pg from "pg";

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import * as schema from "./drizzle/drizzle-schema";
import { eq, gt } from "drizzle-orm";

config({ path: ".env.local" });

const POSTGRES_CONNECTION_STRING = process.env.FLY_DB;

export function initializePostgres() {
  const { Pool } = pg;

  const pool = new Pool({
    connectionString: POSTGRES_CONNECTION_STRING
  });

  pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  return drizzlePg({ schema, client: pool });
}

function convertColumn(col: string) {
  return col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

const MAX_BOOK_ID = 2054;
async function sync() {
  let db = initializePostgres();

  // const books = await db.select().from(schema.books).where(gt(schema.books.id, MAX_BOOK_ID));
  const res = await db.execute(`SELECT * FROM books WHERE id > ${MAX_BOOK_ID}`);
  const books = res.rows;

  const fields = ["authors", "editorial_reviews", "mobile_image_preview", "small_image_preview", "medium_image_preview"] as const;
  for (const book of books) {
    if (fields.some(field => typeof book[field] === "string")) {
      const updates = {};
      fields.forEach(field => {
        if (typeof book[field] === "string") {
          try {
            updates[convertColumn(field)] = JSON.parse(book[field]);
          } catch (er) {}
        }
      });

      await db.update(schema.books).set(updates).where(eq(schema.books.id, book.id));
    }
  }
}
sync();
