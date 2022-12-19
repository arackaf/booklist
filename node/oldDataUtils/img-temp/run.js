const Jimp = require("jimp");
const path = require("path");
const { getPlaiceholder } = require("plaiceholder");

import { getDbAndClient } from "../../dataAccess/connect";

async function execute() {
  const { db, client } = await getDbAndClient();

  const books = await db
    .collection("books")
    .find({
      userId: { $ne: "5b57f71b6871ae00145198ff" }
    })
    .toArray();

  for (let book of books) {
    const { mobileImage, mobileImagePreview, smallImage, smallImagePreview, mediumImage, mediumImagePreview } = book;

    const { title } = book;
    //console.log("Processing", title);
    const biggestImage = mediumImage || smallImage || mobileImage;
    if (!biggestImage) {
      console.log("------ No image at all, skipping");
      continue;
    }
    if (typeof mobileImagePreview === "string" || typeof smallImagePreview === "string" || typeof mediumImagePreview === "string") {
      console.log("------ Outstanding previews that have not been processed - skipping");
      continue;
    }
    if (mobileImagePreview && mobileImagePreview.b64 && smallImagePreview && smallImagePreview.b64 && mediumImagePreview && mediumImagePreview.b64) {
      console.log("Good");
      continue;
    }

    let base64Preview = "";

    try {
      const plaiceholderResult = await getPlaiceholder(biggestImage);
      base64Preview = plaiceholderResult.base64;
    } catch (er) {}

    if (!base64Preview) {
      console.log("------ Could not generate plaiceholderResult");
      continue;
    }
    const updateObject = {};
    if (typeof mobileImagePreview === "object") {
      mobileImagePreview.b64 = base64Preview;
      updateObject.mobileImagePreview = mobileImagePreview;
    }
    if (typeof smallImagePreview === "object") {
      smallImagePreview.b64 = base64Preview;
      updateObject.smallImagePreview = smallImagePreview;
    }
    if (typeof mediumImagePreview === "object") {
      mediumImagePreview.b64 = base64Preview;
      updateObject.mediumImagePreview = mediumImagePreview;
    }
    await db.collection("books").updateOne({ _id: book._id }, { $set: { ...updateObject } });
    console.log("SAVED", title, updateObject);
  }

  client.close();
}

execute();

async function processImg(img) {
  const res = await getPlaiceholder(img);
  // const res = await getPlaiceholder(
  //   "https://d193qjyckdxivp.cloudfront.net/small-covers/60a93babcc3928454b5d1cc6/31f5c317-8a1b-4957-be12-a26e393b7588.jpg"
  // );
  // const res = await getPlaiceholder(img, { dir: "./img" });
  console.log(res.base64, res.base64.length);
  //console.log(res);

  return;
  Jimp.read(img, async (err, image) => {
    image
      //
      //.resize(10, Jimp.AUTO)
      .quality(75);
    //.blur(10);
    preview = await image.getBase64Async(image.getMIME());

    console.log(preview, preview.length);
  });
}

// processImg("https://d193qjyckdxivp.cloudfront.net/medium-covers/60a93babcc3928454b5d1cc6/31f5c317-8a1b-4957-be12-a26e393b7588.jpg");
// processImg("https://d193qjyckdxivp.cloudfront.net/small-covers/573d1b97120426ef0078aa92/981f3e4f-2cc4-4c6c-be58-89764b709095.jpg");
// processImg("https://d193qjyckdxivp.cloudfront.net/small-covers/573d1b97120426ef0078aa92/7bdd9e44-6233-4320-82fa-6a9a4264ee48.jpg");
// processImg("https://d193qjyckdxivp.cloudfront.net/small-covers/573d1b97120426ef0078aa92/a7c767ba-4b8c-42d7-ae23-e7c54a21b9c6.jpg");
// processImg("https://d193qjyckdxivp.cloudfront.net/small-covers/573d1b97120426ef0078aa92/2936c46e-1073-446c-817c-137a28788f0e.jpg");
// processImg("https://d193qjyckdxivp.cloudfront.net/small-covers/573d1b97120426ef0078aa92/475491bc-556b-4cad-b8c8-b85568c58e0e.jpg");
