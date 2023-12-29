import { and, asc, desc, eq, exists, like, or, sql } from "drizzle-orm";
import { union, int, mysqlTable, MySqlTable } from "drizzle-orm/mysql-core";
import { books, booksSubjects, subjects } from "./drizzle-schema";
import { db, executeQuery } from "./dbUtils";

export const userSummary = async (userId: string): Promise<{}> => {
  try {
    false &&
      (await executeQuery(
        "Raw",
        `
      SELECT 'MIN SUBJECT' label, s.name, COUNT(*)
      FROM books b
      JOIN books_subjects bs
          ON b.id = bs.book AND userId = '60a93babcc3928454b5d1cc6'
      JOIN subjects s
          ON bs.subject = s.id
      GROUP BY bs.subject, s.name
      HAVING COUNT(*) = (
          SELECT COUNT(*)
          FROM books b2
          JOIN books_subjects bs2
              ON b2.id = bs2.book
              AND b2.userId = '60a93babcc3928454b5d1cc6'
          GROUP BY bs2.subject
          ORDER BY COUNT(*)
          LIMIT 1
      )
      UNION ALL
      SELECT 'MAX SUBJECT' label, s.name, COUNT(*)
      FROM books b
      JOIN books_subjects bs
          ON b.id = bs.book AND userId = '60a93babcc3928454b5d1cc6'
      JOIN subjects s
          ON bs.subject = s.id
      GROUP BY bs.subject, s.name
      HAVING COUNT(*) = (
          SELECT COUNT(*)
          FROM books b2
          JOIN books_subjects bs2
              ON b2.id = bs2.book
              AND b2.userId = '60a93babcc3928454b5d1cc6'
          GROUP BY bs2.subject
          ORDER BY COUNT(*) DESC
          LIMIT 1
      )
      ORDER BY label, name    
    `
      ).then(val => {
        console.log(val);
      }));

    const subjectCounts = () =>
      db
        .select({ _: sql<number>`COUNT(*)` })
        .from(books)
        .innerJoin(booksSubjects, eq(books.id, booksSubjects.book))
        .groupBy(booksSubjects.subject);

    const subjectsQuery = (value: "MAX" | "MIN") =>
      db
        .select({ label: sql<string>`${value} Subjects`, cnt: sql<number>`COUNT(*)`, name: subjects.name })
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
