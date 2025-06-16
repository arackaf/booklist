import "./util/config";
import { getBookInfo } from "./util/bright-data";

import { initializePostgres } from "./util/dbUtils";
import { processImages } from "./util/process-images";

import { getSimilarBooksWithoutImages, updateSimilarBookImages } from "./util/similar-items-sync";

async function main() {
  const { db, dispose: disposeDb } = initializePostgres();

  let bookNumber = 1;

  try {
    const similarBooks = await getSimilarBooksWithoutImages(db, 5);

    for (const book of similarBooks) {
      let index = bookNumber++;
      let imageUrl: string;

      console.log("Processing similar book image", index, book.title);

      if (/^https?:\/\//.test(book.unprocessedImage)) {
        console.log("Image is on cdn");

        imageUrl = book.unprocessedImage;
      } else {
        console.log("Image not on cdn");

        const { isbn, title } = book;

        const titleForUrl = title
          .replace(/\//g, "")
          .replace(/\s+/g, "-")
          .replace(/[^(\w-)]/g, "");
        const urlToUse = `https://www.amazon.com/${titleForUrl}/dp/${isbn}`;

        const resp = await getBookInfo(urlToUse);
        imageUrl = resp[0]?.image_url;
        console.log("image_url found", imageUrl);
      }

      if (imageUrl) {
        console.log("Processing image", imageUrl);
        const respJson = await processImages(imageUrl);

        if (respJson.mobileImage || respJson.smallImage) {
          console.log("Image processed successfully. Saving ...", respJson);

          //await updateSimilarBookImages(db, book.id, respJson);
        } else {
          console.log("Image processing failed");
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    disposeDb();
  }
}

main();
