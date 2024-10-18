import { type SQLWrapper, and, or, not, eq, sql, isNotNull, like, exists, inArray, desc, asc } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";

import type { Book, BookDetails, BookImages, BookSearch } from "./types";
import { DEFAULT_BOOKS_PAGE_SIZE, EMPTY_BOOKS_RESULTS } from "$lib/state/dataConstants";
import { getInsertLists, runTransaction, type TransactionItem, db, type InferSelection, executeDrizzle } from "./dbUtils";
import { books as booksTable, booksSubjects, booksTags, subjects as subjectsTable, similarBooks as similarBooksTable, books } from "./drizzle-schema";

const defaultBookFields = {
  id: booksTable.id,
  tags: sql<number[]>`COALESCE((${db
    .select({ tags: sql<number[]>`json_agg(tag)` })
    .from(booksTags)
    .where(eq(books.id, booksTags.book))}), '[]'::json)`.as("tags"),
  subjects: sql<number[]>`COALESCE((${db
    .select({ subjects: sql<number[]>`json_agg(subject)` })
    .from(booksSubjects)
    .where(eq(booksSubjects.book, booksTable.id))}), '[]'::json)`.as("subjects"),
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
      conditions.push(
        exists(
          db
            .select({ _: sql`1` })
            .from(sql`json_array_elements_text(${booksTable.authors}) as author`)
            .where(sql`LOWER(author) LIKE ${`%${author.toLowerCase()}%`}`)
        )
      );
    }
    if (isRead != null) {
      conditions.push(eq(booksTable.isRead, isRead));
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

    const fieldsToSelect = resultSet === "compact" ? compactBookFields : resultSet === "ios" ? iosBookFields : defaultBookFields;
    const booksReq = db
      .select(fieldsToSelect as typeof defaultBookFields)
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
  const editorialReviewsQuery = db
    .select({ editorialReviews: booksTable.editorialReviews })
    .from(booksTable)
    .where(and(eq(booksTable.id, Number(id)), isNotNull(booksTable.editorialReviews)));

  const similarBooksQuery = db
    .select()
    .from(similarBooksTable)
    .where(
      exists(
        db
          .select({ _: sql`1` })
          .from(booksTable)
          .where(and(eq(booksTable.id, Number(id)), sql`JSON_SEARCH(${booksTable.similarBooks}, 'one', ${similarBooksTable.isbn})`))
      )
    );

  const [books, similarBooks] = await Promise.all([
    executeDrizzle("editorial reviews", editorialReviewsQuery),
    executeDrizzle("similar books", similarBooksQuery)
  ]);

  const editorialReviews = books.flatMap(b => b.editorialReviews!);

  updateBookImages(similarBooks);

  return { editorialReviews, similarBooks };
};

export const aggregateBooksSubjects = async (userId: string) => {
  const aggQuery = db
    .select({ book: booksSubjects.book, subjects: sql<string>`jsonb_agg(${booksSubjects.subject})`.as("agg.subjects") })
    .from(booksSubjects)
    .innerJoin(subjectsTable, eq(booksSubjects.subject, subjectsTable.id))
    .groupBy(booksSubjects.book)
    .as("agg");

  const query = db
    .select({ count: sql`COUNT(*)`.mapWith(val => Number(val)).as("count"), subjects: aggQuery.subjects })
    .from(booksTable)
    .innerJoin(aggQuery, eq(booksTable.id, aggQuery.book))
    .where(eq(booksTable.userId, userId))
    .groupBy(aggQuery.subjects)
    .having(isNotNull(aggQuery.subjects));

  const results = await executeDrizzle("subject books aggregate", query);

  return results.map(r => ({ ...r, count: +r.count }));
};

export const insertBook = async (userId: string, book: Partial<Book>) => {
  await executeDrizzle(
    "insert book",
    db.transaction(async tx => {
      await tx.insert(booksTable).values({
        title: book.title!,
        pages: book.pages ?? null,
        authors: book.authors ?? [],
        isbn: book.isbn,
        publisher: book.publisher,
        publicationDate: book.publicationDate,
        isRead: !!book.isRead,
        mobileImage: book.mobileImage,
        mobileImagePreview: book.mobileImagePreview ?? null,
        smallImage: book.smallImage,
        smallImagePreview: book.smallImagePreview ?? null,
        mediumImage: book.mediumImage,
        mediumImagePreview: book.mediumImagePreview ?? null,
        userId,
        dateAdded: new Date()
      });

      const idRes = await tx.select({ id: sql`LAST_INSERT_ID()`.mapWith(val => Number(val)) }).from(booksTable);
      const { id } = idRes[0];

      if (book.subjects) {
        await syncBookSubjects(tx, userId, id, book.subjects);
      }
      if (book.tags) {
        await syncBookTags(tx, userId, id, book.tags);
      }
    })
  );
};

export const updateBook = async (userId: string, book: Partial<Book>) => {
  const doImages = Object.hasOwn(book, "mobileImage");
  const imageFields = doImages
    ? {
        mobileImage: book.mobileImage,
        mobileImagePreview: book.mobileImagePreview,
        smallImage: book.smallImage,
        smallImagePreview: book.smallImagePreview,
        mediumImage: book.mediumImage,
        mediumImagePreview: book.mediumImagePreview
      }
    : {};

  const isReadUpdate = book.isRead != null ? { isRead: book.isRead } : {};

  await executeDrizzle(
    "update book",
    db.transaction(async tx => {
      await tx
        .update(booksTable)
        .set({
          ...imageFields,
          ...isReadUpdate,
          title: book.title,
          pages: book.pages,
          authors: book.authors,
          isbn: book.isbn,
          publisher: book.publisher,
          publicationDate: book.publicationDate
        })
        .where(and(eq(booksTable.userId, userId), eq(booksTable.id, book.id!)));

      await syncBookSubjects(tx, userId, book.id!, book.subjects ?? [], true);
      await syncBookTags(tx, userId, book.id!, book.tags ?? [], true);
    })
  );
};

const syncBookTags = async (tx: PgTransaction<any, any, any>, userId: string, bookId: number, tags: number[], clearExisting = false) => {
  if (clearExisting) {
    await tx.delete(booksTags).where(eq(booksTags.book, bookId));
  }
  if (tags.length) {
    await tx.insert(booksTags).values(tags.map(tag => ({ userId, book: bookId, tag })));
  }
};

const syncBookSubjects = async (tx: PgTransaction<any, any, any>, userId: string, bookId: number, subjects: number[], clearExisting = false) => {
  if (clearExisting) {
    await tx.delete(booksSubjects).where(eq(booksSubjects.book, bookId));
  }
  if (subjects.length) {
    await tx.insert(booksSubjects).values(subjects.map(subject => ({ userId: userId, book: bookId, subject })));
  }
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
          INSERT INTO books_subjects (userId, book, subject)
          SELECT DISTINCT ?, tmp.book, tmp.subject
          FROM tmp
          JOIN books b
          ON tmp.book = b.id
          LEFT OUTER JOIN books_subjects existing
          ON existing.book = tmp.book AND existing.subject = tmp.subject
          WHERE b.userId = ? AND existing.book IS NULL AND existing.subject IS NULL
          `,
          [userId, userId]
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
          INSERT INTO books_tags (userId, book, tag)
          SELECT DISTINCT ?, tmp.book, tmp.tag
          FROM tmp
          JOIN books b
          ON tmp.book = b.id
          LEFT OUTER JOIN books_tags existing
          ON existing.book = tmp.book AND existing.tag = tmp.tag
          WHERE b.userId = ? AND existing.book IS NULL AND existing.tag IS NULL
          `,
          [userId, userId]
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
  await executeDrizzle(
    "update books read",
    db
      .update(booksTable)
      .set({ isRead: read })
      .where(and(eq(booksTable.userId, userId), inArray(booksTable.id, ids)))
  );
};

export const deleteBook = async (userId: string, id: number) => {
  await executeDrizzle(
    "delete book",
    db.transaction(async tx => {
      const result = await tx.delete(booksTable).where(and(eq(booksTable.userId, userId), eq(booksTable.id, id)));
      if (result.rowCount !== 1) {
        throw new Error("No access");
      }

      await tx.delete(booksSubjects).where(and(eq(booksSubjects.book, id)));
      await tx.delete(booksTags).where(and(eq(booksTags.book, id)));
    })
  );
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
