import { getMySqlConnection, query } from "./mySqlUtil";

import { isbn13To10 } from "../util/isbn13to10";
import { getBookRelatedItems } from "./scrape";
import { bookSyncFailure, bookSyncSuccess } from "./updateBook";

export const syncOneBook = async () => {
  const mySqlConnection = await getMySqlConnection();
  try {
    const books = (await query(
      mySqlConnection,
      `    
      SELECT id, title, isbn
      FROM books
      WHERE (similarBooksLastSync IS NULL OR DATEDIFF(NOW(), similarBooksLastSync) > 60) AND (CHAR_LENGTH(isbn) = 10 OR CHAR_LENGTH(isbn) = 13)
      ORDER BY id
      LIMIT 1`
    )) as any[];

    if (!books.length) {
      console.log("No books pending sync found");
      return;
    }

    let { id, title, isbn } = books[0];
    if (isbn.length === 13) {
      isbn = isbn13To10(isbn);
      if (isbn == null) {
        await bookSyncFailure(mySqlConnection, id, "13 digit ISBN that can't be converted to 10 digit");
        return;
      }
    }

    try {
      const allResults = await getBookRelatedItems(isbn);

      if (!allResults || !allResults.length) {
        await bookSyncFailure(mySqlConnection, id, "No results");
      } else {
        await bookSyncSuccess(mySqlConnection, id, allResults);
      }
      console.log(
        "Sync complete for",
        id,
        title,
        "similar books found",
        allResults.map(b => b.title)
      );
      return allResults;
    } catch (err) {
      await bookSyncFailure(mySqlConnection, id, `Error: ${err}`);
    }
  } catch (er) {
    console.log("Error: ", er);
  } finally {
    mySqlConnection?.end();
  }
};
