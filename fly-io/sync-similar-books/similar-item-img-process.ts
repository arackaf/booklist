import "./util/config";

import { initializePostgres } from "./util/dbUtils";
import { processImages } from "./util/process-images";

import { getSimilarBooksWithoutImages, updateSimilarBookImages } from "./util/similar-items-sync";

async function main() {
  const { db, dispose: disposeDb } = initializePostgres();

  let bookNumber = 1;

  try {
    const similarBooks = await getSimilarBooksWithoutImages(db, 3);

    for (const book of similarBooks) {
      let index = bookNumber++;
      let imageUrl: string;

      console.log("Processing similar book image", index, book.title, book.unprocessedImage);

      if (/^https?:\/\//.test(book.unprocessedImage)) {
        console.log("Image is on cdn");

        imageUrl = book.unprocessedImage;
      } else {
        console.log("Image not on cdn");
      }

      if (imageUrl) {
        console.log("Processing image", imageUrl);
        const respJson = await processImages(book.unprocessedImage);

        if (respJson.mobileImage || respJson.smallImage) {
          console.log("Image processed successfully. Saving ...", respJson);

          await updateSimilarBookImages(db, book.id, respJson);
        } else {
          console.log("Image processing failed");
        }
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
