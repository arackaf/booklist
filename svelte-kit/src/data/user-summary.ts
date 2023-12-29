import { and, asc, desc, eq, exists, like, or, sql } from "drizzle-orm";
import { union, int, mysqlTable, MySqlTable } from "drizzle-orm/mysql-core";
import { books, booksSubjects, subjects } from "./drizzle-schema";
import { db, executeQuery } from "./dbUtils";

export const userSummary = async (userId: string): Promise<{}> => {
  try {
    const subjectCounts = () =>
      db
        .select({ _: sql<number>`COUNT(*)` })
        .from(books)
        .innerJoin(booksSubjects, eq(books.id, booksSubjects.book))
        .groupBy(booksSubjects.subject);

    const subjectsQuery = (value: "MAX" | "MIN") =>
      db
        .select({ label: sql.raw(`'${value} Subjects'`), cnt: sql<number>`COUNT(*)`, name: subjects.name })
        .from(books)
        .innerJoin(booksSubjects, and(eq(books.id, booksSubjects.book), eq(books.userId, userId)))
        .innerJoin(subjects, eq(booksSubjects.subject, subjects.id))
        .groupBy(booksSubjects.subject, subjects.name)
        .having(
          eq(
            sql`COUNT(*)`,
            subjectCounts()
              .orderBy(value === "MAX" ? desc(sql`COUNT(*)`) : asc(sql`COUNT(*)`))
              .limit(1)
          )
        );

    const results = union(subjectsQuery("MIN"), subjectsQuery("MAX"));

    try {
      console.log("\n\n", results.toSQL(), "\n\n");

      console.log("Drizzle");
      const XXX = await results;
      console.log(XXX);
    } catch (er) {
      console.log("Drizzle Error", er);
    }

    return {};
  } catch (err) {
    console.log("Error reading user summary", err);
    return [];
  }
};
