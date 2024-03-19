import { max } from "drizzle-orm";
import { db, executeDrizzle } from "./dbUtils";
import { books } from "./drizzle-schema";

export const getUserUsageInfo = () => {
  return executeDrizzle(
    "User usage info",
    db
      .select({ userId: books.userId, latest: max(books.dateAdded).as("dateAdded") })
      .from(books)
      .groupBy(books.userId)
      .orderBy(max(books.dateAdded))
  );
};
