const Jimp = require("jimp");
const { connect } = require("../dbConnect");
const { downloadImage } = require("../downloadImage");

async function run() {
  const db = await connect();

  const books = await db.collection("books").find({ userId: "60a93babcc3928454b5d1cc6" }).toArray();

  let i = 0;
  for (const book of books) {
    const { smallImage } = book;
    const { body: imgBody } = await downloadImage(smallImage);

    if (!imgBody) {
      continue;
    }
    const base64 = await updateImage(imgBody);
    if (!base64) {
      continue;
    }

    await db.collection("books").updateOne({ _id: book._id }, { $set: { smallImagePreview: base64 } });
    console.log(book.title, "updated");
  }
}

async function updateImage(src) {
  return new Promise(res => {
    try {
      Jimp.read(src, async function (err, mainImage) {
        if (err || !mainImage) {
          console.log("Failed to read");
          return res(null);
        }

        mainImage.resize(50, Jimp.AUTO).quality(80);

        const thumbnail = mainImage.clone();
        thumbnail.quality(10).blur(1);

        //await thumbnail.writeAsync(getConvertedFilename("thumb-", filename));
        //await mainImage.writeAsync(getConvertedFilename("small-", filename));
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
