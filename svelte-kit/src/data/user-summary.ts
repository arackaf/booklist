import { and, asc, desc, eq, exists, like, or, sql } from "drizzle-orm";
import { union, int, mysqlTable, MySqlTable } from "drizzle-orm/mysql-core";
import { books, booksSubjects, booksTags, subjects, tags } from "./drizzle-schema";
import { db, executeQuery } from "./dbUtils";

export const userSummary = async (userId: string): Promise<{}> => {
  try {
    const tagsCounts = () =>
      db
        .select({ _: sql<number>`COUNT(*)` })
        .from(books)
        .innerJoin(booksTags, eq(books.id, booksTags.book))
        .groupBy(booksTags.tag);

    const tagsQuery = (value: "MAX" | "MIN") =>
      db
        .select({ label: sql.raw(`'${value} Tags'`), count: sql<number>`COUNT(*)`, name: tags.name })
        .from(books)
        .innerJoin(booksTags, and(eq(books.id, booksTags.book), eq(books.userId, userId)))
        .innerJoin(tags, eq(booksTags.tag, tags.id))
        .groupBy(booksTags.tag, tags.name)
        .having(
          eq(
            sql`COUNT(*)`,
            tagsCounts()
              .orderBy(value === "MAX" ? desc(sql`COUNT(*)`) : asc(sql`COUNT(*)`))
              .limit(1)
          )
        );

    const subjectCounts = () =>
      db
        .select({ _: sql<number>`COUNT(*)` })
        .from(books)
        .innerJoin(booksSubjects, eq(books.id, booksSubjects.book))
        .groupBy(booksSubjects.subject);

    const subjectsQuery = (value: "MAX" | "MIN") =>
      db
        .select({ label: sql.raw(`'${value} Subjects'`), count: sql<number>`COUNT(*)`, name: subjects.name })
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

    const results = union(
      db
        .select({ label: sql`'All books'`, count: sql`COUNT(*)`, name: sql`''` })
        .from(books)
        .where(eq(books.userId, userId)),
      subjectsQuery("MIN"),
      subjectsQuery("MAX"),
      tagsQuery("MIN"),
      tagsQuery("MAX")
    );

    try {
      console.log("\n\n", results.toSQL(), "\n\n");

      // console.log("Drizzle");
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
