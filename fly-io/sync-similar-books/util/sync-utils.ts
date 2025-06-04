import { addMonths, format } from "date-fns";
import { desc, eq, isNull, lt, or, InferSelectModel, Update } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/drizzle-schema";
import { books as booksTable } from "../drizzle/drizzle-schema";
import { isbn13To10 } from "../util/isbn13to10";
import { doScrape } from "./scrape";
import { Page } from "puppeteer-core";

type Book = InferSelectModel<typeof booksTable>;

export async function getNextBooks(db: NodePgDatabase<typeof schema>, count: number = 10): Promise<Book[]> {
  const today = new Date();
  const cutoff = addMonths(today, -3);
  const cutoffString = format(cutoff, "yyyy-MM-dd");

  return db
    .select()
    .from(booksTable)
    .where(or(isNull(booksTable.lastAmazonSync), lt(booksTable.lastAmazonSync, cutoffString)))
    .orderBy(desc(booksTable.id))
    .limit(count);
}

export async function syncBook(db: NodePgDatabase<typeof schema>, page: Page, book: Book) {
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

  try {
    const { similarItems, averageReview, numberReviews } = await doScrape(page, isbn, book.title);
    if (similarItems?.length || (averageReview && numberReviews)) {
      await syncComplete(db, book, {
        similarItems,
        averageReview,
        numberReviews
      });
    }
  } catch (er) {
    await failSync(db, book, "Error syncing book");
  }
}

type Updates = {
  similarItems?: any[];
  averageReview: string;
  numberReviews: number;
};
export async function syncComplete(db: NodePgDatabase<typeof schema>, book: Book, updates: Updates) {
  const dbUpdates: Partial<Book> = {};

  if (updates.similarItems?.length) {
    const existingBooks = new Set(book.similarBooks);
    const booksToAdd = updates.similarItems.filter(b => !existingBooks.has(b.isbn)).map(b => b.isbn);

    dbUpdates.similarBooks = updates.similarItems.concat(booksToAdd);
  }

  if (updates.averageReview && updates.numberReviews) {
    dbUpdates.averageReview = updates.averageReview;
    dbUpdates.numberReviews = updates.numberReviews;
  }

  if (updates.averageReview && updates.numberReviews) {
    dbUpdates.averageReview = updates.averageReview;
    dbUpdates.numberReviews = updates.numberReviews;
  }

  await db.update(booksTable).set(dbUpdates).where(eq(booksTable.id, book.id));
}

export async function failSync(db: NodePgDatabase<typeof schema>, book: Book, message: string) {
  console.log("Failing book", book.title, message);
  await db
    .update(booksTable)
    .set({ lastAmazonSync: new Date().toISOString(), lastAmazonSyncSuccess: false, lastAmazonSyncError: message })
    .where(eq(booksTable.id, book.id));
}

export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
