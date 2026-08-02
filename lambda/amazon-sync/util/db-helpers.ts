import { or, isNull, sql, eq, desc } from "drizzle-orm";
import { books } from "../drizzle/drizzle-schema";
import { initializePostgres } from "./pg-helper";

type PostgresDb = Awaited<ReturnType<typeof initializePostgres>>;

export type RatingsData = {
  averageReview: number;
  numberReviews: number;
};

export const getBooksNeedingRatingsSync = async (db: PostgresDb) => {
  return db
    .select({
      id: books.id,
      isbn: books.isbn
    })
    .from(books)
    .where(or(isNull(books.lastRatingsSync), sql`${books.lastRatingsSync} < NOW() - INTERVAL '6 months'`))
    .orderBy(sql`${books.lastRatingsSync} ASC NULLS LAST`, desc(books.id))

    .limit(10);
};

export async function markBooksRatingSynced(
  db: PostgresDb,
  bookIds: number[],
  success: boolean,
  error: string | null,
  ratingsData: RatingsData | null = null
) {
  const today = new Date().toISOString().slice(0, 10);

  const ratingsDataToSet = ratingsData ?? {};
  for (const id of bookIds) {
    await db
      .update(books)
      .set({
        lastRatingsSync: today,
        lastRatingsSyncSuccess: success,
        lastRatingsSyncError: error,
        ...ratingsDataToSet
      })
      .where(eq(books.id, id));
  }
}
