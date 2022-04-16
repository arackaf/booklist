import { getDbConnection } from "../../util/getDbConnection";
import downloadFromUrl from "../../util/downloadFromUrl";

import { encode } from "blurhash";
import fetch from "node-fetch";

const sharpDownload = url => {
  return new Promise<any>(res => {
    fetch(url)
      .then(fetchResponse => fetchResponse.buffer())
      .catch(err => res({ error: true, msg: err }));
  });
};

const Jimp = require("jimp");
const sharp = require("sharp");
const path = require("path");

function getPreview() {
  return new Promise(res => {
    const image = sharp(path.join(__dirname, "./img1.jpg"));

    Promise.resolve(image.metadata()).then(dimensions => {
      console.log(dimensions);
      const { width, height } = dimensions;

      image
        .raw()
        .ensureAlpha()
        .resize(50, 62, { fit: "inside" })
        .toBuffer((err, buffer) => {
          try {
            const blurhash = encode(new Uint8ClampedArray(buffer), width, height, 4, 4);
            return res({ STATUS: "success", blurhash });
          } catch (err) {
            console.log(err);
          }
        });
    });
  });

  // 50 62
}

// function getImageData(image: Image) {
//   const canvas = createCanvas(image.width, image.height);
//   const context = canvas.getContext("2d");
//   context.drawImage(image, 0, 0);
//   return context.getImageData(0, 0, image.width, image.height);
// }

// async function getBlurHash(url: string) {
//   const image = await loadImage(url);
//   console.log("image size", image.width, image.height);
//   const imageData = getImageData(image);
//   const blurHashValue = await blurhash.encode(imageData.data, imageData.width, imageData.height, 4, 4);
//   console.log("blurHashValue", blurHashValue);
//   return { blurhash: blurHashValue, w: image.width, h: image.height };
// }

async function run() {
  const url = "https://my-library-cover-uploads.s3.amazonaws.com/small-covers/60a93babcc3928454b5d1cc6/dcf8480a-21cb-4c53-8179-839d006bd52a.jpg";
  //const { body, error } = await downloadFromUrl(url);

  const result = await getPreview();
  console.log(result);
}

run();
