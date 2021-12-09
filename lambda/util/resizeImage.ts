import Jimp from "jimp";
import sharp from "sharp";

export default async function (src, MAX_WIDTH, MIN_WIDTH = null) {
  try {
    let buffer;
    const body = await sharp(src);
    const metadata = await body.metadata();

    if (MAX_WIDTH != null && metadata.width < MAX_WIDTH) {
      buffer = await body.toBuffer();
    }

    buffer = await body.resize(MAX_WIDTH, undefined, { withoutEnlargement: true }).toBuffer();

    return { body: buffer };
  } catch (err) {
    return { error: true, message: err };
  }
}
