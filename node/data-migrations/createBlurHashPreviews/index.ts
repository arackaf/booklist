import { getDbConnection } from "../../../lambda/util/getDbConnection";

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
  console.log("image size", image.width, image.height);
  const imageData = getImageData(image);
  const blurHashValue = await blurhash.encode(imageData.data, imageData.width, imageData.height, 4, 4);
  console.log("blurHashValue", blurHashValue);
  return { blurhash: blurHashValue, w: image.width, h: image.height };
}

async function run() {
  process.env.stage = "dev";

  console.log("\nOpening DB\n");
  const { db, client } = await getDbConnection();

  console.log("\nDB OPEN\n");

  const books = await db
    .collection("books")
    .find({
      userId: { $ne: "5b57f71b6871ae00145198ff" },
      $or: [{ mobileImagePreview: { $type: "string" } }, { smallImagePreview: { $type: "string" } }, { mediumImagePreview: { $type: "string" } }]
    })
    .limit(3)
    .toArray();

  console.log(books.length, "books to process");
  let i = 1;

  for (const book of books) {
    const ops: Promise<void>[] = [];
    console.log("\n====================================");
    console.log("Processing", book.title, "\n");

    const { mobileImage, mobileImagePreview, smallImage, smallImagePreview, mediumImage, mediumImagePreview } = book;

    console.log("Current img", smallImage);
    const idx = i++;

    try {
      const updateObject = {} as any;
      if (typeof mobileImagePreview === "string") {
        ops.push(
          (async () => {
            try {
              console.log("Updating mobile");
              const blurhashValue = await getBlurHash(mobileImage);

              console.log("Mobile downloaded. Blurhash value ===", blurhashValue);
              updateObject.mobileImagePreview = blurhashValue;
            } catch (er) {
              console.log("Mobile failed");
            }
          })()
        );
      }
      if (typeof smallImagePreview === "string") {
        ops.push(
          (async () => {
            try {
              console.log("Updating small");
              const blurhashValue = await getBlurHash(smallImage);

              console.log("Small downloaded. Blurhash value ===", blurhashValue);
              updateObject.smallImagePreview = blurhashValue;
            } catch (er) {
              console.log("Small failed");
            }
          })()
        );
      }
      if (typeof mediumImagePreview === "string") {
        ops.push(
          (async () => {
            try {
              console.log("Updating medium");
              const blurhashValue = await getBlurHash(mediumImage);

              console.log("Medium downloaded. Blurhash value ===", blurhashValue);
              updateObject.mediumImagePreview = blurhashValue;
            } catch (er) {
              console.log("Medium failed");
            }
          })()
        );
      }
      await Promise.all(ops);

      if (Object.keys(updateObject).length) {
        console.log("#", idx, book.title, "Saving");
        //await db.collection("books").updateOne({ _id: book._id }, { $set: updateObject });
      } else {
        console.log("#", idx, "Nothing to save");
      }
      console.log("#", idx, book.title, "done");

      console.log("====================================\n");
    } catch (er) {
      console.log("#", idx, "Error");
    }
  }

  client.close();
}

run();
