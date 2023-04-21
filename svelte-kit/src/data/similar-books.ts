import { executeQuery } from "./dbUtils";
import type { BookWithSimilarItems } from "./types";

const LIMIT = 50;

export const getBooksWithSimilarBooks = async () => {
  const eligibleBooks = await executeQuery<BookWithSimilarItems>(
    "books that might have similar books",
    `
      SELECT id, title, authors, isbn, smallImage, smallImagePreview
      FROM books 
      WHERE CHAR_LENGTH(isbn) = 10 OR (CHAR_LENGTH(isbn) = 13 AND isbn LIKE '978%')
      LIMIT 50;
    `
  );

  const allIds = eligibleBooks.map(b => b.id);

  const similarBooks = await executeQuery<BookWithSimilarItems>(
    "books that might have similar books",
    `
      SELECT sb.*
      FROM books b
      LEFT JOIN similar_books sb
      ON JSON_SEARCH(b.similarBooks, 'one', sb.isbn)
      WHERE b.id IN (?) AND sb.id IS NOT NULL
      ORDER BY b.id;
    `,
    [allIds]
  );

  console.log(similarBooks.length);

  return eligibleBooks;
};
