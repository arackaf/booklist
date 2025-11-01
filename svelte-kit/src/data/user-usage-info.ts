import { eq, max, count, desc } from "drizzle-orm";
import { db, executeDrizzle } from "./dbUtils";
import { books, userInfoCache } from "./drizzle-schema";

export type UserUsageEntry = Awaited<ReturnType<typeof getUserUsageInfo>>[0];

export const getUserUsageInfo = () => {
  const subQuery = db
    .select({ userId: books.userId, books: count().as("books"), latest: max(books.dateAdded).as("latest") })
    .from(books)
    .groupBy(books.userId)
    .as("bookUser");

  return executeDrizzle(
    "User usage info",
    db
      .select({
        userId: subQuery.userId,
        latest: subQuery.latest,
        books: subQuery.books,
        userName: userInfoCache.name,
        avatar: userInfoCache.avatar,
        email: userInfoCache.email,
        provider: userInfoCache.provider,
        lastSync: userInfoCache.lastSync
      })
      .from(subQuery)
      .leftJoin(userInfoCache, eq(userInfoCache.userId, subQuery.userId))
      .orderBy(desc(subQuery.books))
  );
};
