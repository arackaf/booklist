import path from "path";
import sharp from "sharp";
import { getPlaiceholder } from "plaiceholder";
import { v4 as uuid } from "uuid";
import { sharpDownload } from "./sharpDownload";
import { uploadToS3 } from "./uploadToS3";

type Sizes = "mobile" | "small" | "medium";

export const SIZE_WIDTHS: { [k in Sizes]: number } = {
  mobile: 35,
  small: 50,
  medium: 106
};

export const QUALITIES: { [k in Sizes]: number } = {
  mobile: 80,
  small: 80,
  medium: 90
};

export async function processCover(url, isbn, userId) {
  console.log("Processing image for isbn", isbn);

  const result = await sharpDownload(url);
  if (result.error) {
    console.log("Could not download image");
    return null;
  }

  const body = result.body!;

  const extension = path.extname(url) || ".jpg";

  const img = sharp(body) as any;
  const metadata = await img.metadata();

  const uploadPath = `aaa/${userId}/${uuid()}${extension}`;

  console.log("Width of image", metadata.width);

  if (metadata.width >= SIZE_WIDTHS.medium) {
    console.log("Processing size medium ...");
    return uploadAndGeneratePreviews(img.resize(SIZE_WIDTHS.medium).jpeg({ quality: 95 }), uploadPath, "medium", "small", "mobile");
  } else if (metadata.width >= SIZE_WIDTHS.small) {
    console.log("Processing size small ...");
    return uploadAndGeneratePreviews(img.resize(SIZE_WIDTHS.small).jpeg({ quality: 95 }), uploadPath, "small", "mobile");
  } else if (metadata.width >= SIZE_WIDTHS.mobile) {
    console.log("Processing size mobile ...");
    return uploadAndGeneratePreviews(img.resize(SIZE_WIDTHS.mobile).jpeg({ quality: 95 }), uploadPath, "mobile");
  }

  return null;
}

async function uploadAndGeneratePreviews(sharpImage: any, uploadPath: string, ...sizes: Sizes[]) {
  try {
    const buffer = await sharpImage.toBuffer();
    const metadata = await sharpImage.metadata();
    const s3Result = await uploadToS3(uploadPath, buffer);

    if (!s3Result.success) {
      console.log("Upload to S3 failed");
      return null;
    }
    console.log("Image upload to S3 succeeded");
  } catch (er) {
    console.log("Error sizing and previewing", er);
  }
}

async function generatePreview(sharpImage: any, uploadPath: string, size: Sizes) {}
