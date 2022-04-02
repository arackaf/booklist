const path = require("path");
const uuid = require("uuid/v4");

import downloadFromUrl from "../../util/downloadFromUrl";
import { handleCover } from "../../util/handleCover";
import { getDbConnection } from "../../util/getDbConnection";

async function run() {
  process.env.stage = "live";

  console.log("\nOpening DB\n");
  const { db, client } = await getDbConnection();

  console.log("\nDB OPEN\n");

  const similarBooks = await db.collection("bookSummaries").find({}).toArray();
  const similarBooksWithoutGoodCovers = similarBooks.filter(b => b.smallImage && !/nophoto/.test(b.smallImage || "") && !b.smallImagePreview);

  console.log(similarBooksWithoutGoodCovers.length, "books to process");
  let i = 1;

  for (const book of similarBooksWithoutGoodCovers) {
    console.log("\n====================================");
    console.log("Processing", book.title, "\n");

    const { smallImage } = book;

    console.log("Current img", smallImage);
    const idx = i++;

    try {
      console.log("Downloading ...");
      const { body } = await downloadFromUrl(smallImage);
      console.log("Downloaded");
      if (body) {
        const extension = path.extname(smallImage) || ".jpg";
        const res = await handleCover(body, "small", `similar-books/${uuid()}${extension}`);

        if (res.STATUS === "success") {
          console.log("Cover adjusted successfully. Saving ...");
          await db
            .collection("bookSummaries")
            .updateOne({ _id: book._id }, { $set: { smallImage: res.image.url, smallImagePreview: res.image.preview } });
          console.log("#", idx, book.title, "saved");
          console.log(res.image.url, "previewSize", res.image.preview.length);
        } else {
          await db
            .collection("bookSummaries")
            .updateOne(
              { _id: book._id },
              {
                $set: { smallImage: "https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png", smallImagePreview: "" }
              }
            );
          console.log("#", idx, "Cover handling not successful", res.STATUS);
        }
      } else {
        console.log("#", idx, "Download not successful");
      }

      console.log("====================================\n");
    } catch (er) {
      console.log("#", idx, "Error");
    }
  }

  client.close();
}

run();
