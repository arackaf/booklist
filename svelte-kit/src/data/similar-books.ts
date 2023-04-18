//import type {  } from "./types";
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

  return eligibleBooks;
};
