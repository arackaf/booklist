import { initializePostgres } from "./util/pg-helper";
import { isbn13To10 } from "./util/isbn13to10";
import { getRatingsData } from "./util/brightdata";
import { getBooksNeedingRatingsSync, markBooksRatingSynced, RatingsData } from "./util/db-helpers";

export const ratingsSync = async () => {
  const db = await initializePostgres();

  const booksToSync = await getBooksNeedingRatingsSync(db);

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

    const results = await getRatingsData(isbn10s);

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
