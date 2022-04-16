import { encode } from "blurhash";
import fetch from "node-fetch";

const sharpDownload = url => {
  return fetch(url).then(fetchResponse => fetchResponse.buffer());
};

const sharp = require("sharp");

export async function getBlurhashPreview(url: string) {
  const imgBuffer = await sharpDownload(url);
  const image = sharp(imgBuffer);
  const dimensions = await image.metadata();

  return new Promise(res => {
    console.log("Processing image. Metadata:", dimensions);
    const { width, height } = dimensions;

    image
      .raw()
      .ensureAlpha()
      .resize(50, 62, { fit: "inside" })
      .toBuffer((err, buffer) => {
        try {
          if (err) {
            console.log("Error getting buffer", err);
            return res(null);
          } else {
            const blurhash = encode(new Uint8ClampedArray(buffer), width, height, 4, 4);
            return res(blurhash);
          }
        } catch (err) {
          console.log("Failure", err);
          return res(null);
        }
      });
  });
}
