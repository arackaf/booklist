import { or, isNull, sql, eq } from "drizzle-orm";

import { books } from "./drizzle/drizzle-schema";
import { initializePostgres } from "./util/pg-helper";
import { getSecrets } from "./util/getSecrets";
import { isbn13To10 } from "./util/isbn13to10";

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

type PostgresDb = Awaited<ReturnType<typeof initializePostgres>>;

async function markBooksSynced(
  db: PostgresDb,
  bookIds: number[],
  success: boolean,
  error: string | null,
  extra: Record<string, any> = {}
) {
  const today = new Date().toISOString().slice(0, 10);
  for (const id of bookIds) {
    await db
      .update(books)
      .set({
        lastRatingsSync: today,
        lastRatingsSyncSuccess: success,
        lastRatingsSyncError: error,
        ...extra
      })
      .where(eq(books.id, id));
  }
}

export const ratingsSync = async () => {
  const db = await initializePostgres();

  const staleBooks = await db
    .select({
      id: books.id,
      isbn: books.isbn
    })
    .from(books)
    .where(or(isNull(books.lastRatingsSync), sql`${books.lastRatingsSync} < NOW() - INTERVAL '6 months'`))
    .orderBy(sql`${books.lastRatingsSync} ASC NULLS LAST`)
    .limit(10);

  if (!staleBooks.length) {
    console.log("No books need ratings sync");
    return;
  }

  console.log("Books to sync:", staleBooks.length);

  const validIsbnBooks = staleBooks.filter(b => b.isbn && (b.isbn.length === 10 || b.isbn.length === 13));
  const invalidIsbnBooks = staleBooks.filter(b => !b.isbn || (b.isbn.length !== 10 && b.isbn.length !== 13));

  if (invalidIsbnBooks.length) {
    console.log("Skipping books with invalid ISBNs:", invalidIsbnBooks.length);
    await markBooksSynced(db, invalidIsbnBooks.map(b => b.id), true, null);
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
      await markBooksSynced(db, validIsbnBooks.map(b => b.id), true, null);
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

      const extra: Record<string, any> = {};
      if (match) {
        if (match.rating !== null) {
          extra.averageReview = match.rating;
        }
        if (match.reviewsCount !== null) {
          extra.numberReviews = match.reviewsCount;
        }
      }

      await markBooksSynced(db, [book.id], true, null, extra);
    }

    console.log("Ratings sync completed successfully");
  } catch (err: any) {
    console.error("Ratings sync error:", err);

    await markBooksSynced(db, validIsbnBooks.map(b => b.id), false, err?.message ?? String(err));
  }
};

type SnapshotResult = {
  isbn10: string | null;
  isbn13: string | null;
  rating: number | null;
  reviewsCount: number | null;
};

const getProductDetailData = (type: string, productDetails: { type: string; value: any }[]) => {
  const productDetail = productDetails.find(detail => detail.type === type);
  return productDetail ? productDetail.value : null;
};

const pollForSnapshot = async (snapshotId: string, apiKey: string): Promise<SnapshotResult[]> => {
  for (let i = 0; i < 40; i++) {
    await wait(i < 20 ? 5000 : 10000);

    const progress = await fetch(`https://api.brightdata.com/datasets/v3/progress/${snapshotId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    }).then(res => res.json());

    console.log("Snapshot progress:", progress);

    if (progress.status === "running") {
      continue;
    }

    if (progress.status === "ready") {
      const snapshotData = await fetch(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => (Array.isArray(data) ? data : []));

      console.log("Snapshot data:", snapshotData);

      return snapshotData
        .filter(item => !item.error)
        .map(item => {
          const productDetails = item.product_details ?? [];

          let isbn10 = getProductDetailData("ISBN-10", productDetails);
          let isbn13 = getProductDetailData("ISBN-13", productDetails);

          if (isbn10) isbn10 = isbn10.replace(/-/g, "");
          if (isbn13) isbn13 = isbn13.replace(/-/g, "");

          let reviewsCount: number | null = parseFloat(item.reviews_count);
          let rating: number | null = null;
          if (!reviewsCount) {
            reviewsCount = null;
          } else {
            rating = parseFloat(item.rating);
            if (!rating) {
              reviewsCount = null;
              rating = null;
            }
          }

          return { isbn10, isbn13, rating, reviewsCount };
        });
    }

    throw new Error("Snapshot failed with status: " + progress.status);
  }

  throw new Error("Snapshot timed out");
};
