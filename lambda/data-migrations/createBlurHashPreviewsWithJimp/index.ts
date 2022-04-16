import { encode } from "blurhash";
import fetch from "node-fetch";

const sharpDownload = url => {
  return fetch(url).then(fetchResponse => fetchResponse.buffer());
};

const sharp = require("sharp");

async function getPreview(url: string) {
  const imgBuffer = await sharpDownload(url);

  return new Promise(res => {
    const image = sharp(imgBuffer);

    Promise.resolve(image.metadata()).then(dimensions => {
      console.log(dimensions);
      const { width, height } = dimensions;

      image
        .raw()
        .ensureAlpha()
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
}

async function run() {
  const url = "https://my-library-cover-uploads.s3.amazonaws.com/small-covers/60a93babcc3928454b5d1cc6/dcf8480a-21cb-4c53-8179-839d006bd52a.jpg";
  //const { body, error } = await downloadFromUrl(url);

  const result = await getPreview(url);
  console.log(result);
}

run();
