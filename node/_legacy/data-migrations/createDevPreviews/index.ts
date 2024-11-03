const AWS = require("aws-sdk");

const TABLE_NAME = `My_Library_live`;

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1"
});

const Jimp = require("jimp");

const path = require("path");
const uuid = require("uuid/v4");
import { connect } from "../dbConnect";
import { downloadImage } from "../downloadImage";

import downloadFromUrl from "../../../../lambda/util/downloadFromUrl";
import uploadToS3 from "../../../../lambda/util/uploadToS3";
import { resizeImage, getBuffer } from "../../../../lambda/util/resizeImage";
import { SIZE_WIDTHS, QUALITIES } from "../../../../lambda/util/handleCover";

const imagePath = (size, filePath) => `${size}-covers/${filePath}`;

async function dumpUsers() {
  const res = await dynamo
    .scan({ TableName: TABLE_NAME, FilterExpression: `begins_with(pk, :userVal)`, ExpressionAttributeValues: { ":userVal": "User#" } })
    .promise();

  return res.Items;
}

async function processUser(userId, books, db) {
  for (const book of books) {
    console.log("====================================");
    console.log("Processing", book.title, "\n");
    const { mobileImage, mobileImagePreview, smallImage, smallImagePreview, mediumImage, mediumImagePreview } = book;

    const imageUpdates = {} as any;

    await Promise.all([
      (async () => {
        if (smallImage || mediumImage) {
          try {
            const originalImage = smallImage || mediumImage;

            const { body } = await downloadFromUrl(originalImage);
            if (body) {
              const mobileResults = await resizeImage(body, SIZE_WIDTHS.mobile, QUALITIES.mobile).then(getBuffer);
              if (mobileResults.STATUS === "success") {
                const extension = path.extname(originalImage) || ".jpg";
                const filePath = `${userId}/${uuid()}${extension}`;

                const s3Result = await uploadToS3(imagePath("mobile", filePath), mobileResults.body);
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
      })()
      // (async () => {
      //   if (smallImage && !smallImagePreview) {
      //     try {
      //       const { image, preview } = await moveAndPreview(userId, smallImage, "small");
      //       imageUpdates.smallImage = image;
      //       imageUpdates.smallImagePreview = preview as string;
      //     } catch (er) {
      //       console.log("Er a", er);
      //     }
      //   }
      // })(),
      // (async () => {
      //   if (mediumImage && !mediumImagePreview) {
      //     try {
      //       const { image, preview } = await moveAndPreview(userId, mediumImage, "medium");
      //       imageUpdates.mediumImage = image;
      //       imageUpdates.mediumImagePreview = preview as string;
      //     } catch (er) {
      //       console.log("Er b", er);
      //     }
      //   }
      // })()
    ]);

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
  const users = await dumpUsers();

  for (const user of users) {
    if (user.userId === "5b57f71b6871ae00145198ff") {
      continue;
    }
    console.log("Processing user", user.userId, user.email);
    const books = await db.collection("books").find({ userId: user.userId }).toArray();
    console.log("Found", books.length, "books");
    await processUser(user.userId, books, db);
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
