import "./util/config";

import { initializePostgres } from "./util/dbUtils";

import { init } from "./setup";
import { getNextBooks, syncBook } from "./util/sync-utils";
import { ScrapeOptions } from "./util/scrape";

async function main() {
  const { db, dispose: disposeDb } = initializePostgres();
  const { page, dispose: disposePage } = await init("playwright");
  let bookNumber = 1;

  try {
    const books = await getNextBooks(db, 50);

    for (const book of books) {
      console.log("Syncing book", bookNumber, book.title, book.isbn);

      const scrapeOptions: ScrapeOptions = { scrapeSimilarBooks: true, scrapeReviewData: true };
      await syncBook(db, page, book, bookNumber++ == 0, scrapeOptions);
    }
  } catch (err) {
    console.error(err);
  } finally {
    disposeDb();
    disposePage();
  }
}

main();
