import { and, eq, exists, inArray, getTableColumns, or, sql, type SQLWrapper, like, desc, isNotNull } from "drizzle-orm";
import { db, executeDrizzle } from "./dbUtils";
import { booksSubjects, books as booksTable, similarBooks } from "./drizzle-schema";
import type { BookImages } from "./types";

type QueryProps = {
  page: number;
  userId?: string;
  subjects?: string[];
};

export const getBooksWithSimilarBooks = async ({ page, userId, subjects }: QueryProps = { page: 1 }) => {
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

  const { id, title, authors, isbn, smallImage, smallImagePreview, similarBooks, lastAmazonSync } = getTableColumns(booksTable);
  const eligibleBooks = await executeDrizzle(
    "books that might have similar books",
    db
      .select({
        id,
        title,
        authors,
        isbn: sql<string>`${booksTable.isbn}`,
        smallImage,
        smallImagePreview,
        similarBooks,
        lastAmazonSync,
        similarBooksLastSyncDisplay: sql<string>`''`
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
      .offset((page - 1) * 50)
      .limit(50)
  );

  updateBookImages(eligibleBooks);
  return eligibleBooks;
};

export const clearSync = async (id: number) => {
  await executeDrizzle("clear sync", db.update(booksTable).set({ lastAmazonSync: null }).where(eq(booksTable.id, id)));
};

export const getSimilarBooksForBook = async (id: number) => {
  const result = await executeDrizzle(
    "similar books for book",
    db
      .select(getTableColumns(similarBooks))
      .from(booksTable)
      .leftJoin(similarBooks, sql`${booksTable.similarBooks}::jsonb ? ${similarBooks.isbn}`)
      .where(and(eq(booksTable.id, id), isNotNull(similarBooks.id)))
  );
  updateBookImages(result);

  return result;
};

function updateBookImages<T extends Partial<BookImages>>(books: T[]): T[] {
  const fields = ["mobileImage", "smallImage", "mediumImage"] as const;
  for (const book of books) {
    for (const field of fields) {
      const currentVal = book[field];
      if (currentVal) {
        book[field] = currentVal.replace("my-library-cover-uploads.s3.amazonaws.com", "d193qjyckdxivp.cloudfront.net");
      }
    }
  }

  return books;
}
