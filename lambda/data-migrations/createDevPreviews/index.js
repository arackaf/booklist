const Jimp = require("jimp");
const { connect } = require("../dbConnect");
const { downloadImage } = require("../downloadImage");

async function run() {
  const db = await connect();

  const books = await db.collection("books").find({ userId: "60a93babcc3928454b5d1cc6" }).toArray();

  let i = 0;
  for (const book of books) {
    const { smallImage, mediumImage } = book;

    const [mobileImagePreview, smallImagePreview, mediumImagePreview] = await Promise.all([
      getPreview(smallImage, 35),
      getPreview(smallImage),
      getPreview(mediumImage)
    ]);

    await db.collection("books").updateOne({ _id: book._id }, { $set: { mobileImagePreview, smallImagePreview, mediumImagePreview } });
    console.log(book.title, "updated");
  }
}

async function getPreview(url, previewWidth) {
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
        if (previewWidth) {
          thumbnail.resize(previewWidth, Jimp.AUTO);
        }
        thumbnail.quality(25).blur(8);

        const base64 = await thumbnail.getBase64Async(thumbnail.getMIME());
        res(base64);
      });
    } catch (er) {
      console.log("Failed to save");
      res(null);
    }
  });
}

run();
