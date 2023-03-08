import { getMySqlConnection, query } from "./mySqlUtil";

import { isbn13To10 } from "../util/isbn13to10";
import { getBookRelatedItems } from "./scrape";

export const syncOneBook = async () => {
  const mySqlConnection = await getMySqlConnection();
  try {
    const books = (await query(
      mySqlConnection,
      `    
      SELECT id, isbn
      FROM books
      WHERE id = 1596 AND (CHAR_LENGTH(isbn) = 10 OR CHAR_LENGTH(isbn) = 13)
      ORDER BY id DESC
      LIMIT 1`
    )) as any[];

    if (!books.length || !books[0].isbn) {
      return;
    }

    let { isbn } = books[0];
    if (isbn.length === 13) {
      isbn = isbn13To10(isbn);
      if (isbn == null) {
        return;
      }
    }

    const allResults = await getBookRelatedItems(isbn);

    console.log({ allResults });
    return allResults;
  } catch (er) {
    console.log("Error: ", er);
  } finally {
    mySqlConnection?.end();
  }
};
