import { and, eq, exists, inArray, getTableColumns, or, sql, type SQLWrapper, like, desc, isNotNull } from "drizzle-orm";
import { db, executeDrizzle } from "./dbUtils";
import { booksSubjects, books as booksTable, similarBooks } from "./drizzle-schema";

type QueryProps = {
  userId?: string;
  subjects?: string[];
};

export const getBooksWithSimilarBooks = async ({ userId, subjects }: QueryProps = {}) => {
  const filters: SQLWrapper[] = [];

  if (userId) {
    filters.push(eq(booksTable.userId, userId));
  }

  if (subjects?.length) {
    filters.push(
      exists(
        db
          .select({ _: sql`1` })
          .from(booksSubjects)
          .where(
            and(
              eq(booksSubjects.book, booksTable.id),
              inArray(
                booksSubjects.subject,
                subjects.map(s => Number(s))
              )
            )
          )
      )
    );
  }

  const { id, title, authors, isbn, smallImage, smallImagePreview, similarBooks } = getTableColumns(booksTable);
  const eligibleBooks = await executeDrizzle(
    "books that might have similar books",
    db
      .select({
        id,
        title,
        authors,
        isbn,
        smallImage,
        smallImagePreview,
        similarBooks,
        similarBooksLastSync: sql`DATE_FORMAT(${booksTable.similarBooksLastSync}, '%Y-%m-%dT%TZ')`
      })
      .from(booksTable)
      .where(
        and(
          // isbn 10 or old-school 13
          or(sql`CHAR_LENGTH(${booksTable.isbn}) = 10`, and(sql`CHAR_LENGTH(${booksTable.isbn}) = 13`, like(booksTable.isbn, "978%"))),
          ...filters
        )
      )
      .orderBy(desc(booksTable.id))
      .limit(50)
  );

  return eligibleBooks;
};

export const clearSync = async (id: number) => {
  await executeDrizzle("clear sync", db.update(booksTable).set({ similarBooksLastSync: null }).where(eq(booksTable.id, id)));
};

export const getSimilarBooksForBook = async (id: number) => {
  const result = await executeDrizzle(
    "similar books for book",
    db
      .select(getTableColumns(similarBooks))
      .from(booksTable)
      .leftJoin(similarBooks, sql`JSON_SEARCH(${booksTable.similarBooks}, 'one', ${similarBooks.isbn})`)
      .where(and(eq(booksTable.id, id), isNotNull(similarBooks.id)))
  );

  return result;
};
