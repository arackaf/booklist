import "./util/config";

import { and, desc, eq, like } from "drizzle-orm";
import { initializePostgres } from "./util/dbUtils";

import * as schema from "./drizzle/drizzle-schema";
import { isbn13To10 } from "./util/isbn13to10";
import { getBookInfo } from "./util/bright-data";
import { processImages } from "./util/process-images";
const booksTable = schema.books;

const userId_live = "573d1b97120426ef0078aa92";
const userId = "60a93babcc3928454b5d1cc6";

async function main() {
  const { db, dispose: disposeDb } = initializePostgres();

  try {
    const books = await db
      .select()
      .from(booksTable)
      .where(and(eq(booksTable.userId, userId), like(booksTable.smallImage, "%/medium-covers/%")))
      .orderBy(desc(booksTable.id))
      .limit(5);

    for (const book of books) {
      const { isbn: isbnOriginal, title } = book;
      const isbn = isbnOriginal.length === 13 ? isbn13To10(isbnOriginal) : isbnOriginal;

      if (isbn?.length !== 10) {
        console.log("Skipping book", book.title, "because it doesn't have a valid ISBN");
        continue;
      }
      console.log("Syncing book", book.title);

      const titleForUrl = title
        .replace(/\//g, "")
        .replace(/\s+/g, "-")
        .replace(/[^(\w-)]/g, "");
      const urlToUse = `https://www.amazon.com/${titleForUrl}/dp/${isbn}`;

      const bookInfo = await getBookInfo(urlToUse);
      const imageUrl = bookInfo[0]?.image_url;

      if (imageUrl) {
        const newImageData = await processImages(imageUrl);
        if (newImageData.mediumImage && newImageData.smallImage) {
          console.log("Updating book", book.title);
          await db.update(booksTable).set(newImageData).where(eq(booksTable.id, book.id));
          console.log("Updated");
        }
      }
      console.log(imageUrl, "\n");
    }
  } catch (err) {
    console.log("Error\n\n", err, "\n\n");
  } finally {
    disposeDb();
  }
}

main();
