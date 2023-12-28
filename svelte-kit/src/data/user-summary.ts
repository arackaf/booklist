import { and, asc, desc, eq, exists, like, or, sql } from "drizzle-orm";
import { union } from "drizzle-orm/mysql-core";
import { books, booksSubjects, subjects } from "./drizzle-schema";
import { executeDrizzle, db, executeQuery } from "./dbUtils";

export const userSummary = async (userId: string = ""): Promise<{}> => {
  try {
    await executeQuery(
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
    });

    const subjectCounts = db
      .select({ _: sql<number>`COUNT(*)` })
      .from(books)
      .innerJoin(booksSubjects, eq(books.id, booksSubjects.book))
      .groupBy(booksSubjects.subject);

    const coreQuery = db
      .select({ label: sql`'Yo'`, name: subjects.name })
      .from(books)
      .innerJoin(booksSubjects, and(eq(books.id, booksSubjects.book), eq(books.userId, "60a93babcc3928454b5d1cc6")))
      .innerJoin(subjects, eq(booksSubjects.subject, subjects.id))
      .groupBy(booksSubjects.subject, subjects.name);

    const D = union(
      coreQuery.having(eq(sql`COUNT(*)`, subjectCounts.orderBy(desc(sql`COUNT(*)`)).limit(1))),
      coreQuery.having(eq(sql`COUNT(*)`, subjectCounts.orderBy(asc(sql`COUNT(*)`)).limit(1)))
    );

    try {
      console.log("\n\n", D.toSQL(), "\n\n");

      const XXX = await D;
      console.log("Drizzle");
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
