import * as blurhash from "blurhash";
import { createCanvas, loadImage, Image } from "canvas";

function getImageData(image: Image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

export async function getBlurhashPreview(url: string) {
  console.log("Getting blurhash for", url);
  const image = await loadImage(url);
  console.log("image size", image.width, image.height);
  const imageData = getImageData(image);
  const blurHashValue = await blurhash.encode(imageData.data, imageData.width, imageData.height, 4, 4);

  if (!blurhash.isBlurhashValid(blurHashValue)) {
    console.log("Blurhash encoded incorrectly");
    return null;
  }
  console.log("Success", blurHashValue, image.width, image.height);
  return { blurhash: blurHashValue, w: image.width, h: image.height };
}
