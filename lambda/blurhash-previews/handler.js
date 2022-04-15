const blurhash = require("blurhash");
const { createCanvas, loadImage, Image } = require("canvas");

function getImageData(image) {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

exports.getBlurhashPreview = async function getBlurhashPreview(url) {
  url = "https://my-library-cover-uploads.s3.amazonaws.com/small-covers/60a93babcc3928454b5d1cc6/dcf8480a-21cb-4c53-8179-839d006bd52a.jpg";

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
};
