import "./util/config";

import { addMonths, format } from "date-fns";
import { desc, eq, isNull, lt, or, InferSelectModel, Update } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { initializePostgres } from "./util/dbUtils";
import * as schema from "./drizzle/drizzle-schema";
import { books as booksTable } from "./drizzle/drizzle-schema";
import { isbn13To10 } from "./util/isbn13to10";

type Book = InferSelectModel<typeof booksTable>;

async function getNextBook(db: NodePgDatabase<typeof schema>) {
  const today = new Date();
  const cutoff = addMonths(today, -3);
  const cutoffString = format(cutoff, "yyyy-MM-dd");

  const books = await db
    .select()
    .from(booksTable)
    .where(or(isNull(booksTable.lastAmazonSync), lt(booksTable.lastAmazonSync, cutoffString)))
    .orderBy(desc(booksTable.id))
    .limit(1);

  return books[0] as Book;
}

async function failSync(db: NodePgDatabase<typeof schema>, book: Book, message: string) {
  console.log("Failing book", book.title, message);
  await db
    .update(booksTable)
    .set({ lastAmazonSync: new Date().toISOString(), lastAmazonSyncSuccess: false, lastAmazonSyncError: message })
    .where(eq(booksTable.id, book.id));
}

async function syncComplete(db: NodePgDatabase<typeof schema>, book: Book) {
  type Updates = Partial<Book>;

  let updates: Updates = {};
}

async function syncBook(db: NodePgDatabase<typeof schema>, book: Book) {
  let isbn = book.isbn;

  if (!isbn || (isbn.length !== 10 && isbn.length !== 13)) {
    const message = !isbn ? "No ISBN" : "ISBN has an invalid length";
    await failSync(db, book, message);
    return;
  }

  if (isbn.length === 13) {
    isbn = isbn13To10(isbn);
  }
  if (isbn == null) {
    await failSync(db, book, "Could not convert to an ISBN-10");
    return;
  }

  console.log("Syncing book", book.title, isbn);
}

async function main() {
  const { db, dispose } = initializePostgres();
  try {
    const book = await getNextBook(db);
    await syncBook(db, book);
  } catch (err) {
    console.error(err);
  } finally {
    dispose();
  }
}

main();
