import type { ExecutedQuery, Transaction } from "@planetscale/database";
import { DEFAULT_BOOKS_PAGE_SIZE, EMPTY_BOOKS_RESULTS } from "$lib/state/dataConstants";
import { type SQLWrapper, and, or, not, eq, sql, like, exists, inArray, desc, asc } from "drizzle-orm";

import type { Book, BookDetails, BookImages, BookSearch, SimilarBook } from "./types";
import {
  mySqlConnectionFactory,
  getInsertLists,
  runTransaction,
  executeQueryFirst,
  executeQuery,
  executeCommand,
  type TransactionItem,
  db,
  type InferSelection
} from "./dbUtils";
import { books as booksTable, booksSubjects, booksTags, subjects as subjectsTable } from "../db/schema";
import type { MySqlColumn } from "drizzle-orm/mysql-core";

const defaultBookFields = {
  id: booksTable.id,
  tags: sql<number[]>`COALESCE((SELECT JSON_ARRAYAGG(tag) from books_tags WHERE book = \`books\`.id), JSON_EXTRACT('[]', '$'))`.as("tags"),
  subjects: sql<number[]>`COALESCE((SELECT JSON_ARRAYAGG(subject) from books_subjects WHERE book = \`books\`.id), JSON_EXTRACT('[]', '$'))`.as(
    "subjects"
  ),
  dateAddedDisplay: sql<string>`DATE_FORMAT(dateAdded, '%c/%e/%Y')`,
  title: booksTable.title,
  pages: booksTable.pages,
  userId: booksTable.userId,
  authors: booksTable.authors,
  isbn: booksTable.isbn,
  publisher: booksTable.publisher,
  publicationDate: booksTable.publicationDate,
  isRead: sql<boolean>`isRead`.mapWith(val => val == 1),
  dateAdded: booksTable.dateAdded,
  mobileImage: booksTable.mobileImage,
  mobileImagePreview: booksTable.mobileImagePreview,
  smallImage: booksTable.smallImage,
  smallImagePreview: booksTable.smallImagePreview,
  mediumImage: booksTable.mediumImage,
  mediumImagePreview: booksTable.mediumImagePreview
};

type FullBook = InferSelection<typeof defaultBookFields>;

const compactBookFields = {
  id: booksTable.id,
  title: booksTable.title,
  authors: booksTable.authors,
  isbn: booksTable.isbn,
  publisher: booksTable.publisher,
  isRead: booksTable.isRead,
  smallImage: booksTable.smallImage,
  smallImagePreview: booksTable.smallImagePreview
};

const iosBookFields = {
  id: booksTable.id,
  title: booksTable.title,
  authors: booksTable.authors,
  isRead: booksTable.isRead,
  smallImage: booksTable.smallImage,
  smallImagePreview: booksTable.smallImagePreview,
  mediumImage: booksTable.mediumImage,
  mediumImagePreview: booksTable.mediumImagePreview
};

const compactBookFields_old = ["id", "title", "authors", "isbn", "publisher", "isRead", "smallImage", "smallImagePreview"];
const iosBookFields_old = ["id", "title", "authors", "isRead", "smallImage", "smallImagePreview", "mediumImage", "mediumImagePreview"];

const getSort = (sortPack: any = { id: -1 }) => {
  const [rawField, rawDir] = Object.entries(sortPack)[0];

  if (rawField == "id") {
    return rawDir === -1 ? [desc(booksTable.dateAdded), desc(booksTable.id)] : [asc(booksTable.dateAdded), asc(booksTable.id)];
  }

  const field = rawField === "title" ? booksTable.title : booksTable.pages;
  return rawDir === -1 ? [desc(field)] : [asc(field)];
};

export const searchBooks = async (userId: string, searchPacket: BookSearch) => {
  if (!userId) {
    return EMPTY_BOOKS_RESULTS;
  }

  const conditions: SQLWrapper[] = [];

  const { page, search, publisher, author, tags, searchChildSubjects, subjects, noSubjects, isRead, sort, resultSet } = searchPacket;
  const pageSize = Math.min(searchPacket.pageSize ?? DEFAULT_BOOKS_PAGE_SIZE, 100);
  const skip = (page - 1) * pageSize;

  try {
    const start = +new Date();

    conditions.push(eq(booksTable.userId, userId));

    if (search) {
      conditions.push(like(booksTable.title, `%${search}%`));
    }
    if (publisher) {
      conditions.push(like(booksTable.publisher, `%${publisher}%`));
    }
    if (author) {
      conditions.push(sql`LOWER(${booksTable.authors}->>"$") LIKE ${`%${author.toLowerCase()}%`}`);
    }
    if (isRead != null) {
      conditions.push(eq(booksTable.isRead, isRead ? 1 : 0));
    }
    if (tags.length) {
      conditions.push(
        exists(
          db
            .select({ _: sql`1` })
            .from(booksTags)
            .where(
              and(
                eq(booksTable.id, booksTags.book),
                inArray(
                  booksTags.tag,
                  tags.map(t => Number(t))
                )
              )
            )
        )
      );
    }
    if (subjects.length) {
      if (!searchChildSubjects) {
        conditions.push(
          exists(
            db
              .select({ _: sql`1` })
              .from(booksSubjects)
              .where(
                and(
                  eq(booksTable.id, booksSubjects.book),
                  inArray(
                    booksSubjects.subject,
                    subjects.map(t => Number(t))
                  )
                )
              )
          )
        );
      } else {
        const pathMatch = subjects.map(_ => "s.path LIKE ?").join(" OR ");

        conditions.push(
          exists(
            db
              .select({ _: sql`1` })
              .from(booksSubjects)
              .innerJoin(subjectsTable, eq(booksSubjects.subject, subjectsTable.id))
              .where(
                and(
                  eq(booksTable.id, booksSubjects.book),
                  or(
                    inArray(
                      booksSubjects.subject,
                      subjects.map(s => Number(s))
                    ),
                    ...subjects.map(s => like(subjectsTable.path, `%${s}%`))
                  )
                )
              )
          )
        );
      }
    } else if (noSubjects) {
      conditions.push(
        not(
          exists(
            db
              .select({ _: sql`1` })
              .from(booksSubjects)
              .where(eq(booksSubjects.book, booksTable.id))
          )
        )
      );
    }

    const booksReq = db
      .select(defaultBookFields)
      .from(booksTable)
      .where(and(...conditions))
      .orderBy(...getSort(sort))
      .limit(pageSize)
      .offset(skip);

    const booksCount = db
      .select({ total: sql<string>`count(*)` })
      .from(booksTable)
      .where(and(...conditions));

    const [books, countResp] = await Promise.all([booksReq, booksCount]);
    const end = +new Date();

    console.log(`Query: books page ${page}+${pageSize} ${sort} latency:`, end - start);

    updateBookImages(books);
    const totalBooks = parseInt(countResp[0].total);
    const totalPages = Math.ceil(totalBooks / pageSize);

    return { books, totalBooks, page, totalPages };
  } catch (er) {
    console.log("er", er);
  }
};

export const getBookDetails = async (id: string): Promise<BookDetails> => {
  const editorialReviewsQuery = executeQueryFirst<Book>("editorial reviews", "SELECT editorialReviews FROM books WHERE id = ?", [id]);

  const similarBooksQuery = executeQuery<SimilarBook>(
    "similar books",
    `
    SELECT sb.*
    FROM books b
    LEFT JOIN similar_books sb
    ON JSON_SEARCH(b.similarBooks, 'one', sb.isbn)
    WHERE b.id = ? AND sb.id IS NOT NULL;
    `,
    [id]
  );

  const [book, similarBooks] = await Promise.all([editorialReviewsQuery, similarBooksQuery]);
  const editorialReviews =
    book.editorialReviews ??
    []
      .filter((er: any) => (er.Content || er.content) && (er.Source || er.source))
      .map((er: any) => {
        return {
          content: er.content || er.Content,
          source: er.source || er.Source
        };
      });

  return { editorialReviews, similarBooks: updateBookImages(similarBooks) };
};

export const aggregateBooksSubjects = async (userId: string) => {
  const results = await executeQuery<{ count: string; subjects: any }>(
    "subject books aggregate",
    `
    SELECT
      COUNT(*) count,
      agg.subjects
    FROM books b
    JOIN (
        SELECT
            bs.book,
            JSON_ARRAYAGG(bs.subject) subjects
        FROM books_subjects bs
        JOIN subjects s
        ON bs.subject = s.id
        GROUP BY bs.book
    ) agg
    ON b.id = agg.book
    WHERE b.userId = ?
    GROUP BY agg.subjects
    HAVING agg.subjects IS NOT NULL
  `,
    [userId]
  );

  return results.map((r: any) => ({ ...r, count: +r.count }));
};

export const insertBook = async (userId: string, book: Partial<Book>) => {
  return runTransaction(
    "insert book",
    tx =>
      tx.execute(
        `
      INSERT INTO books (
        title,
        pages,
        authors,
        isbn,
        publisher,
        publicationDate,
        isRead,
        mobileImage,
        mobileImagePreview,
        smallImage,
        smallImagePreview,
        mediumImage,
        mediumImagePreview,
        userId,
        dateAdded
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          book.title,
          book.pages ?? null,
          JSON.stringify(book.authors ?? []),
          book.isbn,
          book.publisher,
          book.publicationDate,
          book.isRead ?? false,
          book.mobileImage,
          JSON.stringify(book.mobileImagePreview ?? null),
          book.smallImage,
          JSON.stringify(book.smallImagePreview ?? null),
          book.mediumImage,
          JSON.stringify(book.mediumImagePreview ?? null),
          userId,
          new Date()
        ]
      ),
    tx => tx.execute("SELECT LAST_INSERT_ID() as id"),
    async (tx, newId) => {
      const bookId = +(newId!.rows[0] as any).id;

      const result: ExecutedQuery[] = [];
      if (book.subjects?.length) {
        result.push(...(await syncBookSubjects(tx, bookId, book.subjects)));
      }
      if (book.tags?.length) {
        result.push(...(await syncBookTags(tx, bookId, book.tags)));
      }
      return result;
    }
  );
};

export const updateBook = async (userId: string, book: Partial<Book>) => {
  const doImages = Object.hasOwn(book, "mobileImage");

  const imageFields = doImages
    ? [
        book.mobileImage,
        JSON.stringify(book.mobileImagePreview ?? null),
        book.smallImage,
        JSON.stringify(book.smallImagePreview ?? null),
        book.mediumImage,
        JSON.stringify(book.mediumImagePreview ?? null)
      ]
    : [];

  return runTransaction(
    "update book",
    tx =>
      tx.execute(
        `
        UPDATE books
        SET 
          title = ?,
          pages = ?,
          authors = ?,
          isbn = ?,
          publisher = ?,
          publicationDate = ?,
          isRead = ?${
            doImages
              ? `,
          mobileImage = ?,
          mobileImagePreview = ?,
          smallImage = ?,
          smallImagePreview = ?,
          mediumImage = ?,
          mediumImagePreview = ?`
              : ""
          }
        WHERE id = ? AND userId = ?;`,
        [
          // core fields
          book.title,
          book.pages ?? null,
          JSON.stringify(book.authors ?? []),
          book.isbn,
          book.publisher,
          book.publicationDate,
          book.isRead ?? false
        ]
          .concat(imageFields)
          .concat(book.id, userId)
      ),
    tx => syncBookSubjects(tx, book.id!, book.subjects ?? [], true),
    tx => syncBookTags(tx, book.id!, book.tags ?? [], true)
  );
};

const syncBookTags = async (tx: Transaction, bookId: number, tags: number[], clearExisting = false): Promise<ExecutedQuery[]> => {
  const tagPairs = tags.map(tagId => [bookId, tagId]);
  const result: ExecutedQuery[] = [];

  if (clearExisting) {
    result.push(await tx.execute(`DELETE FROM books_tags WHERE book = ?`, [bookId]));
  }
  if (tags.length) {
    result.push(
      await tx.execute(
        `
        INSERT INTO books_tags (book, tag)
        VALUES ${getInsertLists(tagPairs)}
        `,
        tagPairs
      )
    );
  }
  return result;
};

const syncBookSubjects = async (tx: Transaction, bookId: number, subjects: number[], clearExisting = false): Promise<ExecutedQuery[]> => {
  const subjectPairs = subjects.map(subjectId => [bookId, subjectId]);
  const result: ExecutedQuery[] = [];

  if (clearExisting) {
    result.push(await tx.execute(`DELETE FROM books_subjects WHERE book = ?`, [bookId]));
  }
  if (subjects.length) {
    result.push(
      await tx.execute(
        `
        INSERT INTO books_subjects (book, subject)
        VALUES ${getInsertLists(subjectPairs)}
        `,
        subjectPairs
      )
    );
  }

  return result;
};

type BulkUpdate = {
  ids: string[];
  add: string[];
  remove: string[];
};

export const updateBooksSubjects = async (userId: string, updates: BulkUpdate) => {
  const { ids, add, remove } = updates;

  const addPairs = ids.flatMap(bookId => add.map(addId => [bookId, addId]));
  const removePairs = ids.flatMap(bookId => remove.map(addId => [bookId, addId]));

  if (!addPairs.length && !removePairs.length) {
    return;
  }

  const ops: TransactionItem[] = [tx => tx.execute(`CREATE TEMPORARY TABLE tmp (book INT NOT NULL, subject INT NOT NULL);`)];

  if (addPairs.length) {
    ops.push(
      tx => tx.execute(`INSERT INTO tmp (book, subject) VALUES ${getInsertLists(addPairs)};`, addPairs),
      tx =>
        tx.execute(
          `
          INSERT INTO books_subjects (book, subject)
          SELECT DISTINCT tmp.book, tmp.subject
          FROM tmp
          JOIN books b
          ON tmp.book = b.id
          LEFT OUTER JOIN books_subjects existing
          ON existing.book = tmp.book AND existing.subject = tmp.subject
          WHERE b.userId = ? AND existing.book IS NULL AND existing.subject IS NULL
          `,
          [userId]
        ),
      tx => tx.execute(`DELETE FROM tmp`)
    );
  }
  if (removePairs.length) {
    ops.push(
      tx => tx.execute(`INSERT INTO tmp (book, subject) VALUES ${getInsertLists(removePairs)};`, removePairs),
      tx =>
        tx.execute(
          `
          DELETE FROM books_subjects
          WHERE EXISTS (
            SELECT 1
            FROM tmp
            WHERE books_subjects.book = tmp.book AND books_subjects.subject = tmp.subject
          );
          `
        )
    );
  }

  await runTransaction("update books' subjects", ...ops);
};

export const updateBooksTags = async (userId: string, updates: BulkUpdate) => {
  const { ids, add, remove } = updates;

  const addPairs = ids.flatMap(bookId => add.map(addId => [bookId, addId]));
  const removePairs = ids.flatMap(bookId => remove.map(addId => [bookId, addId]));

  if (!addPairs.length && !removePairs.length) {
    return;
  }

  const ops: TransactionItem[] = [tx => tx.execute(`CREATE TEMPORARY TABLE tmp (book INT NOT NULL, tag INT NOT NULL);`)];
  if (addPairs.length) {
    ops.push(
      tx => tx.execute(`INSERT INTO tmp (book, tag) VALUES ${getInsertLists(addPairs)};`, addPairs),
      tx =>
        tx.execute(
          `
          INSERT INTO books_tags (book, tag)
          SELECT DISTINCT tmp.book, tmp.tag
          FROM tmp
          JOIN books b
          ON tmp.book = b.id
          LEFT OUTER JOIN books_tags existing
          ON existing.book = tmp.book AND existing.tag = tmp.tag
          WHERE b.userId = ? AND existing.book IS NULL AND existing.tag IS NULL
          `,
          [userId]
        ),
      tx => tx.execute(`DELETE FROM tmp`)
    );
  }
  if (removePairs.length) {
    ops.push(
      tx => tx.execute(`INSERT INTO tmp (book, tag) VALUES ${getInsertLists(removePairs)};`, removePairs),
      tx =>
        tx.execute(
          `
          DELETE FROM books_tags
          WHERE EXISTS (
            SELECT 1
            FROM tmp
            WHERE books_tags.book = tmp.book AND books_tags.tag = tmp.tag
          );
          `
        )
    );
  }

  await runTransaction("update books' tags", ...ops);
};

export const updateBooksRead = async (userId: string, ids: number[], read: boolean) => {
  await executeCommand(
    "update book read status",
    `
    UPDATE books
    SET isRead = ?
    WHERE userId = ? AND id IN (?)
  `,
    [read, userId, ids]
  );
};

export const deleteBook = async (userId: string, id: number) => {
  await executeCommand("delete book", `DELETE FROM books WHERE userId = ? AND id IN (?)`, [userId, id]);
};

function updateBookImages<T extends BookImages>(books: T[]): T[] {
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
