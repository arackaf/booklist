import { executeCommand, executeQuery } from "./dbUtils";
import type { BookWithSimilarItems, SimilarBook } from "./types";

const LIMIT = 50;

type QueryProps = {
  userId?: string;
};

export const getBooksWithSimilarBooks = async ({ userId }: QueryProps = {}) => {
  let filters = "";
  const args: any[] = [];
  if (userId) {
    filters += "AND userId = ?";
    args.push(userId);
  }
  const eligibleBooks = await executeQuery<BookWithSimilarItems>(
    "books that might have similar books",
    `
      SELECT id, title, authors, isbn, smallImage, smallImagePreview, similarBooks, DATE_FORMAT(similarBooksLastSync, '%Y-%m-%dT%TZ') similarBooksLastSync
      FROM books 
      WHERE CHAR_LENGTH(isbn) = 10 OR (CHAR_LENGTH(isbn) = 13 AND isbn LIKE '978%') ${filters}
      ORDER BY id DESC
      LIMIT 50;
    `,
    args
  );

  return eligibleBooks;
};

export const clearSync = async (id: number) => {
  const eligibleBooks = await executeCommand(
    "clear sync",
    `
      UPDATE books
      SET similarBooksLastSync = NULL
      WHERE id = ?;
    `,
    [id]
  );
};

export const getSimilarBooksForBook = async (id: number) => {
  const similarBooks = await executeQuery<SimilarBook>(
    "similar books for book",
    `
      SELECT sb.*
      FROM books b
      LEFT JOIN similar_books sb
      ON JSON_SEARCH(b.similarBooks, 'one', sb.isbn)
      WHERE b.id = ? AND sb.id IS NOT NULL;
    `,
    [id]
  );

  return similarBooks;
};
