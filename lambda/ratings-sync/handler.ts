import { or, isNull, sql, eq } from "drizzle-orm";

import { books } from "./drizzle/drizzle-schema";
import { initializePostgres } from "./util/pg-helper";
import { getSecrets } from "./util/getSecrets";
import { isbn13To10 } from "./util/isbn13to10";
import { pollForSnapshot } from "./util/brightdata";
import { markBooksRatingSynced, RatingsData } from "./util/db-helpers";

export const ratingsSync = async () => {
  const db = await initializePostgres();

  const booksToSync = await db
    .select({
      id: books.id,
      isbn: books.isbn
    })
    .from(books)
    .where(or(isNull(books.lastRatingsSync), sql`${books.lastRatingsSync} < NOW() - INTERVAL '6 months'`))
    .orderBy(sql`${books.lastRatingsSync} ASC NULLS LAST`)
    .limit(10);

  if (!booksToSync.length) {
    console.log("No books need ratings sync");
    return;
  }

  console.log("Books to sync:", booksToSync.length);

  const validIsbnBooks = booksToSync.filter(b => b.isbn && (b.isbn.length === 10 || b.isbn.length === 13));
  const invalidIsbnBooks = booksToSync.filter(b => !b.isbn || (b.isbn.length !== 10 && b.isbn.length !== 13));

  if (invalidIsbnBooks.length) {
    console.log("Skipping books with invalid ISBNs:", invalidIsbnBooks.length);
    await markBooksRatingSynced(
      db,
      invalidIsbnBooks.map(b => b.id),
      true,
      null
    );
  }

  if (!validIsbnBooks.length) {
    console.log("No valid ISBN books to look up");
    return;
  }

  try {
    const secrets = await getSecrets();
    const BRIGHT_DATA_API_KEY = secrets["bright-data-key"];

    const isbn10s = [...new Set(validIsbnBooks.map(b => isbn13To10(b.isbn!)).filter(Boolean))] as string[];

    if (!isbn10s.length) {
      await markBooksRatingSynced(
        db,
        validIsbnBooks.map(b => b.id),
        true,
        null
      );
      return;
    }

    const resp = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwhideng15g8jg63s7&include_errors=true`, {
      method: "POST",
      body: JSON.stringify(isbn10s.map(isbn => ({ url: `https://www.amazon.com/dp/${isbn}` }))),
      headers: {
        Authorization: `Bearer ${BRIGHT_DATA_API_KEY}`,
        "Content-Type": "application/json"
      }
    }).then(res => res.json());

    const { snapshot_id } = resp;
    console.log("Snapshot ID:", snapshot_id);

    if (!snapshot_id) {
      throw new Error("No snapshot ID returned from Bright Data");
    }

    const results = await pollForSnapshot(snapshot_id, BRIGHT_DATA_API_KEY);

    for (const book of validIsbnBooks) {
      const isbn10 = isbn13To10(book.isbn!);
      const match = results.find(r => r.isbn10 === isbn10 || r.isbn13 === book.isbn || r.isbn10 === book.isbn);

      let ratingsData: RatingsData | null = null;

      if (match && match.rating !== null && match.reviewsCount !== null) {
        let averageReview = match.rating;
        let numberReviews = match.reviewsCount;

        if (averageReview && numberReviews) {
          ratingsData = {
            averageReview,
            numberReviews
          };
        }
      }

      await markBooksRatingSynced(db, [book.id], true, null, ratingsData);
    }

    console.log("Ratings sync completed successfully");
  } catch (err: any) {
    console.error("Ratings sync error:", err);

    await markBooksRatingSynced(
      db,
      validIsbnBooks.map(b => b.id),
      false,
      err?.message ?? String(err)
    );
  }
};
