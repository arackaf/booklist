import { and, eq, exists, like, or, sql } from "drizzle-orm";
import { books, subjects } from "./drizzle-schema";
import { executeDrizzle, db } from "./dbUtils";

export const userSummary = async (userId: string = ""): Promise<{ booksCount: number }[]> => {
  try {
    const booksQuery = db
      .select({
        booksCount: sql<number>`cast(count(*)) as int`
      })
      .from(books)
      .where(eq(books.userId, userId));
    return executeDrizzle("read subjects", booksQuery);
  } catch (err) {
    console.log("Error reading user summary", err);
    return [];
  }
};
