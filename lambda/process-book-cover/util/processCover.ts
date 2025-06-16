import path from "path";
import sharp, { Sharp, Metadata } from "sharp";
import { getPlaiceholder } from "plaiceholder";
import { v4 as uuid } from "uuid";

import { sharpDownload } from "./sharpDownload";
import { uploadToS3 } from "./uploadToS3";

type Sizes = "mobile" | "small" | "medium";

type ImgPreview = {
  w: number;
  h: number;
  b64: string;
};

type ImageData = {
  mobileImage: string;
  mobileImagePreview: ImgPreview;
  smallImage: string;
  smallImagePreview: ImgPreview;
  mediumImage: string;
  mediumImagePreview: ImgPreview;
};

const SIZE_WIDTHS: { [k in Sizes]: number } = {
  mobile: 35,
  small: 50,
  medium: 106
};

export async function processCover(url, userId) {
  const result = await sharpDownload(url);
  if (result.error) {
    console.log("Could not download image");
    return null;
  }

  const body = result.body!;
  const extension = path.extname(url) || ".jpg";

  const img = sharp(body);
  const metadata = await img.metadata();

  const uploadPath = (size: Sizes) => `${size}-covers/${userId}/${uuid()}${extension}`;

  if (metadata.width >= SIZE_WIDTHS.medium * 2) {
    return uploadAndGeneratePreviews(img, uploadPath, "medium", "small", "mobile");
  } else if (metadata.width >= SIZE_WIDTHS.small * 2) {
    return uploadAndGeneratePreviews(img, uploadPath, "small", "mobile");
  }

  return null;
}

async function uploadAndGeneratePreviews(originalImage: Sharp, getUloadPath: (size: string) => string, ...sizes: Sizes[]) {
  const [currentSize, ...otherSizes] = sizes;

  try {
    const mainSizeResult = await processSize(originalImage, currentSize, getUloadPath);
    if (!mainSizeResult) {
      return null;
    }

    const { url, base64, metaData } = mainSizeResult;
    const result: Partial<ImageData> = {};

    fillImageData(currentSize, result, url, base64, metaData);

    for (const size of otherSizes) {
      const nextSizeResult = await processSize(originalImage, size, getUloadPath);

      if (!nextSizeResult) {
        continue;
      }

      const { url, base64, metaData } = nextSizeResult;
      fillImageData(size, result, url, base64, metaData);
    }

    return result;
  } catch (er) {
    console.log("Error sizing and previewing", er);
    return null;
  }
}

async function processSize(image: Sharp, size: Sizes, getUloadPath: (size: string) => string) {
  const sizedImage = await sizeImage(image, SIZE_WIDTHS[size] * 2);

  const buffer = await sizedImage.toBuffer();
  const uploadPath = getUloadPath(size);
  const s3Result = await uploadToS3(uploadPath, buffer);

  if (!s3Result.success) {
    console.log("Upload to S3 failed");
    return null;
  }
  console.log("Image upload to S3 succeeded");

  const { url } = s3Result;
  const { base64 } = await getPreview(url);
  const metaData = await getSizeMetadata(sizedImage, size);

  return { url, base64, metaData };
}

function fillImageData(size: Sizes, imgData: Partial<ImageData>, url: string, base64Preview: string, imgMetaData: Metadata) {
  const { width: w, height: h } = imgMetaData;
  const previewPacket: ImgPreview = { w, h, b64: base64Preview };

  switch (size) {
    case "medium":
      imgData.mediumImage = url;
      imgData.mediumImagePreview = previewPacket;
    case "small":
      imgData.smallImage = url;
      imgData.smallImagePreview = previewPacket;
    case "mobile":
      imgData.mobileImage = url;
      imgData.mobileImagePreview = previewPacket;
  }
}

async function sizeImage(img: Sharp, width: number) {
  const sizedImageBuffer = await img.resize(width).jpeg({ quality: 95 }).toBuffer();
  return sharp(sizedImageBuffer);
}

async function getPreview(url: string) {
  return getPlaiceholder(url);
}

async function getSizeMetadata(sharpImage: Sharp, size: Sizes) {
  const sizedImage = await sizeImage(sharpImage, SIZE_WIDTHS[size]);

  return sizedImage.metadata();
}
