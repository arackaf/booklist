const Jimp = require("jimp");

const path = require("path");
const uuid = require("uuid/v4");
import { connect } from "../dbConnect";
import { downloadImage } from "../downloadImage";

import downloadFromUrl from "../../util/downloadFromUrl";
import uploadToS3 from "../../util/uploadToS3";
import { resizeImage } from "../../util/resizeImage";
import { SIZE_WIDTHS, QUALITIES } from "../../util/handleCover";

const imagePath = (size, filePath) => `${size}-covers/${filePath}`;
async function processUser(userId, books, db) {
  for (const book of books) {
    console.log("====================================");
    console.log("Processing", book.title, "\n");
    const { mobileImage, mobileImagePreview, smallImage, smallImagePreview, mediumImage, mediumImagePreview } = book;

    const imageUpdates = {} as any;

    if (!mobileImagePreview && (smallImage || mediumImage)) {
      try {
        const originalImage = smallImage || mediumImage;

        const { body } = await downloadFromUrl(originalImage);
        if (body) {
          const mobileResults = await resizeImage(body, SIZE_WIDTHS.mobile, QUALITIES.mobile);
          if (mobileResults.STATUS === "success") {
            const extension = path.extname(originalImage) || ".jpg";
            const filePath = `${userId}/${uuid()}${extension}`;

            const s3Result = await uploadToS3(imagePath("mobile", filePath), new Buffer(body));
            if (s3Result.STATUS === "success") {
              imageUpdates.mobileImage = s3Result.url;
              imageUpdates.mobileImagePreview = mobileResults.preview;
            }
          }
        }
      } catch (er) {
        console.log("error ", er);
      }
    }

    if (smallImage && !smallImagePreview) {
      try {
        const { image, preview } = await moveAndPreview(userId, smallImage, "small");
        imageUpdates.smallImage = image;
        imageUpdates.smallImagePreview = preview as string;
      } catch (er) {
        console.log("Er a", er);
      }
    }

    if (mediumImage && !mediumImagePreview) {
      try {
        const { image, preview } = await moveAndPreview(userId, mediumImage, "medium");
        imageUpdates.mediumImage = image;
        imageUpdates.mediumImagePreview = preview as string;
      } catch (er) {
        console.log("Er b", er);
      }
    }

    if (Object.keys(imageUpdates).length) {
      console.log("Saving book...");
      await db.collection("books").updateOne({ _id: book._id }, { $set: { ...imageUpdates } });
    } else {
      console.log("Nothing to update");
    }
    console.log(book.title, "updated");
  }
}

async function moveAndPreview(userId, url, size) {
  try {
    const { body } = await downloadFromUrl(url);
    if (body) {
      const preview = await getPreview(url);

      const extension = path.extname(url) || ".jpg";
      const filePath = `${userId}/${uuid()}${extension}`;

      const s3Result = await uploadToS3(imagePath(size, filePath), new Buffer(body));
      if (s3Result.STATUS === "success") {
        return {
          image: s3Result.url,
          preview
        };
      }
    }
    return {};
  } catch (err) {
    console.log("error c", err);
    return {};
  }
}

async function run() {
  const [client, db] = (await connect()) as any;
  const users = await db.collection("users").find({}).toArray();

  for (const user of users) {
    if ("" + user._id === "5b57f71b6871ae00145198ff") {
      continue;
    }
    console.log("Processing user", user._id, user.email);
    const books = await db
      .collection("books")
      .find({ userId: "" + user._id })
      .toArray();
    console.log("Found", books.length, "books");
    await processUser("60a93babcc3928454b5d1cc6", books, db);
  }

  client.close();
}

async function getPreview(url) {
  if (!url) {
    return "";
  }
  const { body: imgBody } = await downloadImage(url);

  if (!imgBody) {
    return "";
  }

  return new Promise(res => {
    try {
      Jimp.read(imgBody, async function (err, mainImage) {
        if (err || !mainImage) {
          console.log("Failed to read");
          return res(null);
        }

        const thumbnail = mainImage.clone();
        thumbnail.quality(25).blur(8);

        const base64 = await thumbnail.getBase64Async(thumbnail.getMIME());
        res(base64);
      });
    } catch (er) {
      console.log("Failed to save", er);
      res(null);
    }
  });
}

run();
