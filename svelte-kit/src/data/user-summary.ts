import { and, eq, exists, like, or, sql } from "drizzle-orm";
import { books, subjects } from "./drizzle-schema";
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

    return {};
  } catch (err) {
    console.log("Error reading user summary", err);
    return [];
  }
};
