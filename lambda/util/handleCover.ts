import uuid from "uuid/v4";

import uploadToS3 from "../util/uploadToS3";
import corsResponse from "../util/corsResponse";
import { resizeImage } from "./resizeImage";

export async function handleCover(body, size, userId, extension) {
  if (size === "small") {
    const smallImageResult = await resizeImage(body, 50, null, 80);
    const mobileImageResult = await resizeImage(body, 35, null, 80);

    if (smallImageResult.error || !smallImageResult.body || mobileImageResult.error || !mobileImageResult.body) {
      console.log("Error resizing", mobileImageResult.error, smallImageResult.error);
      return corsResponse({ error: true });
    }

    const mobileImagePath = `mobile-covers/${userId}/${uuid()}${extension}`;
    const smallImagePath = `small-covers/${userId}/${uuid()}${extension}`;

    const s3MobileResult = await uploadToS3(mobileImagePath, mobileImageResult.body);
    const s3SmallResult = await uploadToS3(smallImagePath, smallImageResult.body);

    if (s3MobileResult.STATUS === "success" && s3SmallResult.STATUS === "success") {
      return corsResponse({
        success: true,
        smallImage: { url: s3SmallResult.url, preview: smallImageResult.preview },
        mobileImage: { url: s3MobileResult.url, preview: mobileImageResult.preview }
      });
    } else {
      console.log(
        "Error uploading",
        s3MobileResult.STATUS === "error" ? s3MobileResult.message : null,
        s3SmallResult.STATUS === "error" ? s3SmallResult.message : null
      );
      return corsResponse({
        success: false,
        error: true
      });
    }
  } else {
    const mediumImageResult = await resizeImage(body, 106, null, 80);

    if (mediumImageResult.error || !mediumImageResult.body) {
      console.log("Error resizing", mediumImageResult.error);
      return corsResponse({ error: true });
    }

    const mediumImagePath = `medium-covers/${userId}/${uuid()}${extension}`;
    const s3MediumResult = await uploadToS3(mediumImagePath, mediumImageResult.body);

    if (s3MediumResult.STATUS === "success") {
      return corsResponse({
        success: true,
        mediumImage: { url: s3MediumResult.url, preview: mediumImageResult.preview }
      });
    } else {
      console.log("Erorr uploading", s3MediumResult.message);
      return corsResponse({
        success: false,
        error: true
      });
    }
  }
}
