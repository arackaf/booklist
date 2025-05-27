import { getPlaiceholder } from "plaiceholder";

import { getBlurhashPreview } from "./getBlurhashPreview";
import { getDbConnection } from "../util/getDbConnection";

export async function handler() {
  const { db, client } = await getDbConnection();

  try {
    const books = await db
      .collection("books")
      .find({
        userId: { $ne: "5b57f71b6871ae00145198ff" },
        $or: [{ mobileImagePreview: { $type: "string" } }, { smallImagePreview: { $type: "string" } }, { mediumImagePreview: { $type: "string" } }]
      })
      .limit(25)
      .toArray();

    console.log(books.length, "books to process");
    let i = 1;

    for (const book of books) {
      const ops: Promise<void>[] = [];
      console.log("\n====================================");
      console.log("Processing", book.title, "\n");

      const { mobileImage, mobileImagePreview, smallImage, smallImagePreview, mediumImage, mediumImagePreview } = book;

      let mobileBase64Preview = "";
      let smallBase64Preview = "";
      let mediumBase64Preview = "";

      const previewQueues: Promise<any>[] = [];

      if (mobileImage) {
        previewQueues.push(
          (async () => {
            try {
              const plaiceholderResult = await getPlaiceholder(mobileImage);
              mobileBase64Preview = plaiceholderResult.base64 || "";
            } catch (er) {}
          })()
        );
      }
      if (smallImage) {
        previewQueues.push(
          (async () => {
            try {
              const plaiceholderResult = await getPlaiceholder(smallImage);
              smallBase64Preview = plaiceholderResult.base64 || "";
            } catch (er) {}
          })()
        );
      }
      if (mediumImage) {
        previewQueues.push(
          (async () => {
            try {
              const plaiceholderResult = await getPlaiceholder(mediumImage);
              mediumBase64Preview = plaiceholderResult.base64 || "";
            } catch (er) {}
          })()
        );
      }

      await Promise.all(previewQueues);

      console.log("Current img", smallImage);
      const idx = i++;

      try {
        const updateObject = {} as any;
        if (typeof mobileImagePreview === "string") {
          ops.push(
            (async () => {
              try {
                console.log("Updating mobile");
                const blurhashValue = await getBlurhashPreview(mobileImage);
                (blurhashValue as any).b64 = mobileBase64Preview;

                if (blurhashValue) {
                  console.log("Mobile downloaded. Blurhash value ===", blurhashValue);
                  updateObject.mobileImagePreview = blurhashValue;
                } else {
                  console.log("Mobile download failed");
                }
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
                const blurhashValue = await getBlurhashPreview(smallImage);
                (blurhashValue as any).b64 = smallBase64Preview;

                if (blurhashValue) {
                  console.log("Small downloaded. Blurhash value ===", blurhashValue);
                  updateObject.smallImagePreview = blurhashValue;
                } else {
                  console.log("Small download failed");
                }
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
                const blurhashValue = await getBlurhashPreview(mediumImage);
                (blurhashValue as any).b64 = mediumBase64Preview;

                if (blurhashValue) {
                  console.log("Medium downloaded. Blurhash value ===", blurhashValue);
                  updateObject.mediumImagePreview = blurhashValue;
                } else {
                  console.log("Medium download failed");
                }
              } catch (er) {
                console.log("Medium failed");
              }
            })()
          );
        }
        await Promise.all(ops);

        if (Object.keys(updateObject).length) {
          console.log("#", idx, book.title, "Saving");
          await db.collection("books").updateOne({ _id: book._id }, { $set: updateObject });
        } else {
          console.log("#", idx, "Nothing to save");
        }
        console.log("#", idx, book.title, "done");

        console.log("====================================\n");
      } catch (er) {
        console.log("#", idx, "Error");
      }
    }

    await client?.close();
  } catch (er) {
    try {
      await client?.close();
    } catch (er) {}
  }
}
