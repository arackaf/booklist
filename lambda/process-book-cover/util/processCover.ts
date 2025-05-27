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

const QUALITIES: { [k in Sizes]: number } = {
  mobile: 80,
  small: 80,
  medium: 90
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

  if (metadata.width >= SIZE_WIDTHS.medium) {
    return uploadAndGeneratePreviews(img, uploadPath("medium"), "medium", "small", "mobile");
  } else if (metadata.width >= SIZE_WIDTHS.small) {
    return uploadAndGeneratePreviews(img, uploadPath("small"), "small", "mobile");
  } else if (metadata.width >= SIZE_WIDTHS.mobile) {
    return uploadAndGeneratePreviews(img, uploadPath("mobile"), "mobile");
  }

  return null;
}

async function uploadAndGeneratePreviews(originalImage: Sharp, uploadPath: string, ...sizes: Sizes[]) {
  const [currentSize, ...otherSizes] = sizes;

  const sizedImage = await sizeImage(originalImage, currentSize);

  try {
    const buffer = await sizedImage.toBuffer();
    const s3Result = await uploadToS3(uploadPath, buffer);

    if (!s3Result.success) {
      console.log("Upload to S3 failed");
      return null;
    }
    console.log("Image upload to S3 succeeded");

    const { url } = s3Result;
    const { base64 } = await getPreview(url);
    const metaData = await sizedImage.metadata();

    const result: Partial<ImageData> = {};

    fillImageData(currentSize, result, url, base64, metaData);

    for (const size of otherSizes) {
      const sizedMetadata = await getSizeMetadata(sizedImage, size);
      fillImageData(size, result, url, base64, sizedMetadata);
    }

    return result;
  } catch (er) {
    console.log("Error sizing and previewing", er);
    return null;
  }
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

async function sizeImage(img: Sharp, size: Sizes) {
  const sizedImageBuffer = await img.resize(SIZE_WIDTHS[size]).jpeg({ quality: 95 }).toBuffer();
  return sharp(sizedImageBuffer);
}

async function getPreview(url: string) {
  return getPlaiceholder(url);
}

async function getSizeMetadata(sharpImage: Sharp, size: Sizes) {
  const sizedImage = await sizeImage(sharpImage, size);

  return sizedImage.metadata();
}
