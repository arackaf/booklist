const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const del = require("del");

const quality = 75;

const IMG_DIR_NAME = "./temp";

const getFileName = filename => "./temp/" + filename;
const getConvertedFilename = (prefix, filename, outputExt) => {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);

  return `./temp/${prefix}${base}${outputExt || ext}`;
};

function clearTempFolder() {
  try {
    del.sync(IMG_DIR_NAME);
    fs.mkdirSync(IMG_DIR_NAME);
  } catch (er) {}
}

async function updateImage(inputFileName, quality, blur, output) {
  const filename = path.basename(inputFileName);

  return new Promise(res => {
    Jimp.read(getFileName(filename), async function (err, image) {
      if (err || !image) {
        console.log("Failed to read", filename);
        return res({ error: true, message: err });
      }

      image.resize(50, Jimp.AUTO);

      const thumbnail = image.clone();
      const mainImage = image.clone();

      thumbnail.quality(10).blur(1);
      mainImage.quality(80);

      try {
        await thumbnail.writeAsync(getConvertedFilename("thumb2-", filename));
        await mainImage.writeAsync(getConvertedFilename("small-", filename));
        //const base64 = await image.getBase64Async(image.getMIME());
        res();
      } catch (er) {
        console.log("Failed to save", filename, er);
      }
    });
  });
}

//clearTempFolder();

updateImage("img1.jpg");
updateImage("img2.jpg");
// updateImage("img1.jpg", 20, null, "20-small");
// updateImage("img1.jpg", 10, null, "10-small");
// updateImage("img1.jpg", 20, 10, "20-small-blur-10");
// updateImage("img1.jpg", 20, 1, "20-small-blur-1");
// updateImage("img1.jpg", 10, 1, "10-small-blur-1");
// updateImage("img1.jpg", 1, 1, "1-small-blur-1");
// updateImage("img1.jpg", 20, 1, "20-small-blur-1");

// updateImage("img1.jpg", 20, null, "20-small-png", ".png");
// updateImage("img1.jpg", 20, 1, "20-small-blur-1-png", ".png");
// updateImage("img1.jpg", 10, 1, "10-small-blur-1-png", ".png");
// updateImage("img1.jpg", 1, 1, "1-small-blur-1-png", ".png");
// updateImage("img1.jpg", 20, 1, "20-small-blur-1-png", ".png");
