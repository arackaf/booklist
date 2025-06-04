import "./util/config";

import { initializePostgres } from "./util/dbUtils";

import { init } from "./setup";
import { getNextBooks, syncBook, wait } from "./util/sync-utils";

async function main() {
  const { db, dispose: disposeDb } = initializePostgres();
  const { page, dispose: disposePage } = await init("playwright");
  let bookNumber = 1;

  try {
    const books = await getNextBooks(db);
    for (const book of books) {
      console.log("Syncing book", bookNumber, book.title, book.isbn);

      await wait(bookNumber++ === 1 ? 10000 : 3000);

      await syncBook(db, page, book);
    }
  } catch (err) {
    console.error(err);
  } finally {
    disposeDb();
    disposePage();
  }
}

main();
