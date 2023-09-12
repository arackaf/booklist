import type { ExecutedQuery, Transaction } from "@planetscale/database";
import { DEFAULT_BOOKS_PAGE_SIZE, EMPTY_BOOKS_RESULTS } from "$lib/state/dataConstants";

import type { Book, BookDetails, BookImages, BookSearch, SimilarBook } from "./types";
import {
  mySqlConnectionFactory,
  getInsertLists,
  runTransaction,
  executeQueryFirst,
  executeQuery,
  executeCommand,
  type TransactionItem,
  db
} from "./dbUtils";
import { books, booksTags } from "../db/schema";
import { and, eq, sql, exists } from "drizzle-orm";

const defaultBookFields: (keyof Book)[] = [
  "id",
  "title",
  "pages",
  "userId",
  "authors",
  "isbn",
  "publisher",
  "publicationDate",
  "isRead",
  "dateAdded",
  "mobileImage",
  "mobileImagePreview",
  "smallImage",
  "smallImagePreview",
  "mediumImage",
  "mediumImagePreview"
];

const compactBookFields = ["id", "title", "authors", "isbn", "publisher", "isRead", "smallImage", "smallImagePreview"];
const iosBookFields = ["id", "title", "authors", "isRead", "smallImage", "smallImagePreview", "mediumImage", "mediumImagePreview"];

const getSort = (sortPack: any = { id: -1 }) => {
  const [rawField, rawDir] = Object.entries(sortPack)[0];

  if (rawField == "id") {
    return rawDir === -1 ? "ORDER BY dateAdded DESC, id DESC" : "ORDER BY dateAdded, id";
  }

  const field = rawField === "title" ? "title" : "pages";
  const dir = rawDir === -1 ? "DESC" : "ASC";
  return `ORDER BY ${field} ${dir}`;
};

export const searchBooks = async (userId: string, searchPacket: BookSearch) => {
  if (!userId) {
    return EMPTY_BOOKS_RESULTS;
  }

  const authorSearch = "S";
  //userId = "123";

  const tag = 34;

  const queryAST = db
    .select()
    .from(books)
    .where(
      and(
        // yo Prettier, chill and leave the line breaks
        eq(books.userId, userId),
        sql`LOWER(${books.authors}->>"$") LIKE ${`%${authorSearch.toLowerCase()}%`}`,
        exists(
          db
            .select({ _: sql`1` })
            .from(booksTags)
            .where(and(eq(books.id, booksTags.book), eq(booksTags.tag, tag)))
        )
      )
    );

  const res = await queryAST.execute();
  console.log(res.length);

  const x = queryAST.toSQL();

  console.log("\n\nBooks Query:\n  ", x.sql, "\n  ", x.params, "\n\n");

  const { page, search, publisher, author, tags, searchChildSubjects, subjects, noSubjects, isRead, sort, resultSet } = searchPacket;
  const pageSize = Math.min(searchPacket.pageSize ?? DEFAULT_BOOKS_PAGE_SIZE, 100);
  const skip = (page - 1) * pageSize;

  try {
    const conn = mySqlConnectionFactory.connection();

    const start = +new Date();

    const filters = ["userId = ?"];
    const args: any[] = [userId];

    if (search) {
      filters.push("title LIKE ?");
      args.push(`%${search}%`);
    }
    if (publisher) {
      filters.push("publisher LIKE ?");
      args.push(`%${publisher}%`);
    }
    if (author) {
      filters.push(`LOWER(authors->>"$") LIKE ?`);
      args.push(`%${author.toLowerCase()}%`);
    }
    if (isRead != null) {
      filters.push("isRead = ?");
      args.push(isRead);
    }
    if (tags.length) {
      filters.push("EXISTS (SELECT 1 FROM books_tags bt WHERE bt.book = b.id AND bt.tag IN (?))");
      args.push(tags);
    }
    if (subjects.length) {
      if (!searchChildSubjects) {
        filters.push("EXISTS (SELECT 1 FROM books_subjects bs WHERE bs.book = b.id AND bs.subject IN (?))");
        args.push(subjects);
      } else {
        const pathMatch = subjects.map(_ => "s.path LIKE ?").join(" OR ");
        filters.push(
          `EXISTS (SELECT 1 FROM books_subjects bs JOIN subjects s ON bs.subject = s.id WHERE bs.book = b.id AND (bs.subject IN (?) OR ${pathMatch}))`
        );
        args.push(subjects, ...subjects.map(id => `%,${id},%`));
      }
    } else if (noSubjects) {
      filters.push("NOT EXISTS (SELECT 1 FROM books_subjects bs WHERE bs.book = b.id)");
    }

    const fieldsToSelect = resultSet === "compact" ? compactBookFields : resultSet === "ios" ? iosBookFields : defaultBookFields;
    const sortExpression = getSort(sort);

    const mainBooksProjection = `
      SELECT 
        ${fieldsToSelect.join(",")},
        (SELECT JSON_ARRAYAGG(tag) from books_tags WHERE book = b.id) tags, 
        (SELECT JSON_ARRAYAGG(subject) from books_subjects WHERE book = b.id) subjects`;
    const filterBody = `
      FROM books b 
      WHERE ${filters.join(" AND ")}`;

    const booksReq = conn.execute(`${mainBooksProjection}${filterBody} ${sortExpression} LIMIT ?, ?`, args.concat(skip, pageSize)) as any;
    const countReq = conn.execute(`SELECT COUNT(*) total ${filterBody}`, args) as any;

    const [booksResp, countResp] = await Promise.all([booksReq, countReq]);
    const end = +new Date();

    console.log(
      `Query: books page ${page}+${pageSize} ${sortExpression.replace("ORDER BY ", "")} latency:`,
      end - start,
      "query time (books, count):",
      booksResp.time.toFixed(1) + ",",
      countResp.time.toFixed(1)
    );

    const books: Book[] = updateBookImages(booksResp.rows);
    const totalBooks = parseInt(countResp.rows[0].total);
    const totalPages = Math.ceil(totalBooks / pageSize);

    const arrayFieldsToInit = ["subjects", "tags"] as (keyof Book)[];
    books.forEach(book => {
      arrayFieldsToInit.forEach(arr => {
        if (!Array.isArray(book[arr])) {
          (book as any)[arr] = [] as string[];
        }
      });

      book.isRead = (book.isRead as any) == 1;

      const date = new Date(book.dateAdded);
      book.dateAddedDisplay = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });

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
