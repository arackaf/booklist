import { Page } from "playwright-core";
import { isbn13To10 } from "../util/isbn13to10";
import { query, getMySqlConnection, getNextBookToSync, getBook } from "./mySqlUtil";
import { doScrape, getAuthorFromBookPage, getBookRelatedItems, getBrowser, getPage } from "./scrape";
import { bookSyncFailure, bookSyncSuccess } from "./updateBook";

export const syncBook = async ({ id }) => {
  console.log("Id sent", id);
  const book = await getBook(id);

  console.log("book found", { book });
  if (book) {
    try {
      await doSync(book);
      console.log("Done with sync");
    } catch (er) {
      console.log("Error", er);
    }
  }
};

export const localSync = async () => {
  let browser: any;
  let page: Page;
  let captchaDone = false;
  try {
    let book;
    book = { id: 1, title: "The Forging of the Union, 1781-1789 (New American Nation Series)", isbn: "9780060914240" };
    // book = await getNextBookToSync();

    if (!book) {
      return;
    }

    browser = await getBrowser();
    page = await getPage(browser);

    while (book) {
      await doSync(book, page, captchaDone);
      await new Promise(res => setTimeout(res, 4000));
      book = null;
      // book = await getNextBookToSync();
      captchaDone = true;
    }
  } catch (er) {
    console.log("Error: ", er);
  } finally {
    try {
      await page?.close();
    } catch (er) {}
    try {
      await browser?.close();
    } catch (er) {}
  }
};

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

async function doSync(book: any, page?: Page, captchaDone: boolean = false) {
  // const mySqlConnection = await getMySqlConnection();

  let { id, title, isbn } = book;
  try {
    if (isbn.length === 13) {
      isbn = isbn13To10(isbn);
      if (isbn == null) {
        console.log("13 digit ISBN that can't be converted to 10 digit");
        // await bookSyncFailure(mySqlConnection, id, "13 digit ISBN that can't be converted to 10 digit");
        return;
      }
    }

    console.log("Starting related items sync for", id, isbn, title);

    if (!captchaDone && process.env.stage === "local") {
      await new Promise(res => setTimeout(res, 10000));
    }
    // this is absolutely awful but I don't have time to make it less so
    const allResults = page ? await doScrape(page, isbn, title, captchaDone) : await getBookRelatedItems(isbn, title);

    if (!allResults || !allResults.length) {
      // await bookSyncFailure(mySqlConnection, id, "No results");
      console.log("Sync complete for", id, title, "No results found");
      return;
    } else {
      // await bookSyncSuccess(mySqlConnection, id, allResults);
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
    console.log("Error", err);
    // await bookSyncFailure(mySqlConnection, id, `Error: ${err}`);
  } finally {
    // mySqlConnection?.end();
  }
}

export async function doSyncAuthor() {
  const mySqlConnection = await getMySqlConnection();
  const [book] = await query<any>(
    mySqlConnection,
    `
    SELECT id, isbn, title 
    FROM similar_books
    WHERE 
      (authorsLastManualSync IS NULL OR DATEDIFF(NOW(), authorsLastManualSync) > 60) 
      AND 
      (authors IS NULL OR (json_contains(authors, json_array(), '$') AND json_length(authors, '$') = 0)) 
    ORDER BY id 
    LIMIT 1
  `
  );

  let { id, isbn, title } = book;
  console.log({ id, isbn, title });
  try {
    if (isbn.length === 13) {
      isbn = isbn13To10(isbn);
      if (isbn == null) {
        console.log("Bad isbn");
        return;
      }
    }

    const author = await getAuthorFromBookPage(isbn);

    try {
      await query<any>(
        mySqlConnection,
        `
          UPDATE similar_books
          SET authors = ?, authorsLastManualSync = ?
          WHERE id = ?
          `,
        [JSON.stringify([author || "<>"]), new Date(), id]
      );
      console.log("Updated", id, " - ", title, "with", author);
    } catch (er) {
      console.log("Error", er);
    }
  } catch (err) {
  } finally {
    mySqlConnection?.end();
  }
}
