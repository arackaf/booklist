import { addMonths, format } from "date-fns";
import { desc, eq, isNull, lt, or, InferSelectModel, InferInsertModel, Update, inArray } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/drizzle-schema";
import { books as booksTable } from "../drizzle/drizzle-schema";
import { isbn13To10 } from "../util/isbn13to10";
import { doScrape, SimilarBookResult } from "./scrape";
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
  try {
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

    const { similarBooks, averageReview, numberReviews } = await doScrape(page, isbn, book.title);
    if (similarBooks?.length) {
      similarBooks?.forEach(b => {
        b.isbn = b.isbn.toUpperCase();
      });
    }

    await syncComplete(db, book, {
      similarBooks,
      averageReview,
      numberReviews
    });
  } catch (er) {
    console.log("Error syncing book", er);
    await failSync(db, book, "Error syncing book");
  }
}

type SimilarBookInsert = typeof schema.similarBooks.$inferInsert;

type Updates = {
  similarBooks?: SimilarBookResult[];
  averageReview: string;
  numberReviews: number;
};
export async function syncComplete(db: NodePgDatabase<typeof schema>, book: Book, updates: Updates) {
  const dbUpdates: Partial<Book> = {};
  console.log("Sync data found", updates);

  if (!updates.averageReview && !updates.numberReviews) {
    if (book.averageReview || book.numberReviews) {
      console.log("No data found, but book has reviews, skipping");
      return;
    }
  }

  if (updates.similarBooks?.length) {
    const existingBooks = new Set(book.similarBooks?.map(isbn => isbn));
    const booksToAdd = updates.similarBooks.filter(b => !existingBooks?.has(b.isbn)).map(b => b.isbn);

    dbUpdates.similarBooks = (book.similarBooks ?? []).concat(booksToAdd);

    const existingSimilarBooks = await db
      .select({ isbn: schema.similarBooks.isbn })
      .from(schema.similarBooks)
      .where(inArray(schema.similarBooks.isbn, dbUpdates.similarBooks ?? []));

    const existingSimilarBooksSet = new Set(existingSimilarBooks.map(b => b.isbn));
    const similarBooksToAdd = updates.similarBooks.filter(b => !existingSimilarBooksSet.has(b.isbn));

    const similarBooksToInsert = similarBooksToAdd.map(book => {
      return { isbn: book.isbn, title: book.title, unprocessedImage: book.img, authors: book.authors } satisfies SimilarBookInsert;
    });

    if (similarBooksToInsert.length) {
      await db.insert(schema.similarBooks).values(similarBooksToInsert);
    }
  }

  if (updates.averageReview && updates.numberReviews) {
    dbUpdates.averageReview = updates.averageReview;
    dbUpdates.numberReviews = updates.numberReviews;
  }

  await db
    .update(booksTable)
    .set({
      ...dbUpdates,
      // reset last sync'd info
      lastAmazonSync: new Date().toISOString(),
      lastAmazonSyncSuccess: true,
      lastAmazonSyncError: null
    })
    .where(eq(booksTable.id, book.id));
}

export async function failSync(db: NodePgDatabase<typeof schema>, book: Book, message: string) {
  console.log("Failing book", book.title, message);
  await db
    .update(booksTable)
    .set({ lastAmazonSync: new Date().toISOString(), lastAmazonSyncSuccess: false, lastAmazonSyncError: message })
    .where(eq(booksTable.id, book.id));
}

export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
