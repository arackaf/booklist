import { isbn13To10 } from "../util/isbn13to10";
import { getMySqlConnection, getNextBookToSync } from "./mySqlUtil";
import { getBookRelatedItems } from "./scrape";
import { bookSyncFailure, bookSyncSuccess } from "./updateBook";

export const syncNextBook = async () => {
  try {
    const book = await getNextBookToSync();

    if (!book) {
      console.log("No books pending sync found");
      return;
    }

    await doSync(book);
  } catch (er) {
    console.log("Error: ", er);
  }
};

async function doSync(book: any) {
  const mySqlConnection = await getMySqlConnection();

  let { id, title, isbn } = book;
  try {
    if (isbn.length === 13) {
      isbn = isbn13To10(isbn);
      if (isbn == null) {
        await bookSyncFailure(mySqlConnection, id, "13 digit ISBN that can't be converted to 10 digit");
        return;
      }
    }

    const allResults = await getBookRelatedItems(isbn);

    if (!allResults || !allResults.length) {
      await bookSyncFailure(mySqlConnection, id, "No results");
      console.log("Sync complete for", id, title, "No results found");
      return;
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
}
