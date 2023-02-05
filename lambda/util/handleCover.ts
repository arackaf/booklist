//import uploadToS3 from "../util/uploadToS3";
var uploadToS3: any = {};
import { resizeImage, getBuffer, ResizeImageFailure, ResizeInvalidSize } from "./resizeImage";

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

type HandleCoverSuccess = { STATUS: "success"; image: { url: string; preview: string } };
export type HandleCoverResult = ResizeImageFailure | ResizeInvalidSize | HandleCoverSuccess;

export async function handleCover(body, size: Sizes, imagePath): Promise<HandleCoverResult> {
  const width = SIZE_WIDTHS[size];
  const quality = QUALITIES[size];

  const imageResult = await resizeImage(body, width, quality).then(getBuffer);
  if (imageResult.STATUS === "error") {
    return { STATUS: "error" };
  }
  if (imageResult.STATUS === "invalid-size") {
    return { STATUS: "invalid-size" };
  }

  const s3Result = await uploadToS3(imagePath, imageResult.body);

  if (s3Result.STATUS === "success") {
    return {
      STATUS: "success",
      image: { url: s3Result.url, preview: imageResult.preview }
    };
  } else {
    console.log("Error uploading", s3Result.STATUS === "error" ? s3Result.message : null);
    return { STATUS: "error" };
  }
}
