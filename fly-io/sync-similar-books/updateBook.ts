import { query } from "./mySqlUtil";

export const getInsertLists = (lists: any[]) => Array.from({ length: lists.length }, () => "(?)").join(", ");

export async function bookSyncFailure(connection: any, id: number, reason: string) {
  await query(
    connection,
    `
    UPDATE books 
    SET similarBooksLastSyncSuccess = false,
        similarBooksLastSync = ?,
        similarBooksLastSyncFailureReason = ?
    WHERE id = ?
  `,
    [new Date(), reason, id]
  );
}

export async function bookSyncSuccess(connection: any, id: number, results: any[]) {
  const isbns = results.map(b => b.isbn);

  const existing = await query<any>(connection, `SELECT isbn FROM similar_books WHERE isbn IN (?)`, [isbns]);
  const isbnsToSkip = new Set(existing.map(b => b.isbn));

  const booksToInsert = results
    .filter(book => !isbnsToSkip.has(book.isbn))
    .map(book => [
      book.title,
      JSON.stringify(book.author ? [book.author] : []),
      book.isbn,
      book.mobileImage || "",
      JSON.stringify(book.mobileImagePreview || null),
      book.smallImage || "",
      JSON.stringify(book.smallImagePreview || null)
    ]);

  const existingSimilarBooks = await query<any>(connection, `SELECT similarBooks books FROM books WHERE id = ?`, [id]);
  const similarBooks = existingSimilarBooks[0].similarBooks ?? [];

  const isbnsToInsert = [...new Set([...similarBooks, ...isbns])];

  await query(
    connection,
    `
    UPDATE books 
    SET similarBooks = ?,
        similarBooksLastSyncSuccess = true,
        similarBooksLastSync = ?,
        similarBooksLastSyncFailureReason = ''
    WHERE id = ?
  `,
    [JSON.stringify(isbnsToInsert), new Date(), id]
  );

  if (booksToInsert.length) {
    await query(
      connection,
      `
    INSERT INTO similar_books (title, authors, isbn, mobileImage, mobileImagePreview, smallImage, smallImagePreview)
    VALUES ?
    `,
      [booksToInsert]
    );
  }
}
