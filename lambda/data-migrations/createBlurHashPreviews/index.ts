import { getDbConnection } from "../../util/getDbConnection";

import * as blurhash from "blurhash";
import { createCanvas, loadImage, Image } from "canvas";

function getImageData(image: Image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

async function getBlurHash(url: string) {
  const image = await loadImage(url);
  console.log(" image = ", image.width, image.height);
  const imageData = getImageData(image);
  const blurHashValue = await blurhash.encode(imageData.data, imageData.width, imageData.height, 4, 4);
  return { blurhash: blurHashValue, w: image.width, h: image.height };
}

async function run() {
  process.env.stage = "dev";

  console.log("\nOpening DB\n");
  const { db, client } = await getDbConnection();

  console.log("\nDB OPEN\n");

  const books = await db
    .collection("books")
    .find({ previewsUpdated: { $ne: true }, $and: [{ smallImagePreview: { $exists: true } }, { smallImagePreview: { $ne: "" } }] })
    .toArray();

  console.log(books.length, "books to process");
  let i = 1;

  for (const book of books) {
    console.log("\n====================================");
    console.log("Processing", book.title, "\n");

    const { smallImage } = book;

    console.log("Current img", smallImage);
    const idx = i++;

    try {
      console.log("Downloading ...");

      const blurhashValue = await getBlurHash(smallImage);

      console.log("Downloaded. Blurhash value ===", blurhashValue);

      await db.collection("books").updateOne({ _id: book._id }, { $set: { smallImagePreview: JSON.stringify(blurhashValue) } });
      console.log("#", idx, book.title, "saved");

      // await db.collection("bookSummaries").updateOne(
      //   { _id: book._id },
      //   {
      //     $set: { smallImage: "https://s.gr-assets.com/assets/nophoto/book/50x75-a91bf249278a81aabab721ef782c4a74.png", smallImagePreview: "" }
      //   }
      // );
      console.log("#", idx, "Cover handling not successful");

      //} else {
      console.log("#", idx, "Download not successful");
      //}

      console.log("====================================\n");
    } catch (er) {
      console.log("#", idx, "Error");
    }
  }

  client.close();
}

run();
