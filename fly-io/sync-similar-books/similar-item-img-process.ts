import "./util/config";

import { initializePostgres } from "./util/dbUtils";

import { getSimilarBooksWithoutImages } from "./util/similar-items-sync";

async function main() {
  const { db, dispose: disposeDb } = initializePostgres();

  let bookNumber = 1;

  try {
    const similarBooks = await getSimilarBooksWithoutImages(db, 50);

    for (const book of similarBooks) {
      let index = bookNumber++;
      if (/^https?:\/\//.test(book.unprocessedImage)) {
        console.log("Image is on cdn");
      } else {
        console.log("Image not on cdn");
      }

      //console.log("Syncing similar book image", index, book.title, book.unprocessedImage);
    }
  } catch (err) {
    console.error(err);
  } finally {
    disposeDb();
  }
}

main();
