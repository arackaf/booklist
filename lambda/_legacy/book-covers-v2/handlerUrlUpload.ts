import path from "path";
import uuid from "uuid/v4";

import { handleCover, HandleCoverResult } from "../../util/handleCover";
import downloadFromUrl from "../../util/downloadFromUrl";

export const handler = async event => {
  const { userId, url, similarBookCover = false } = event;

  const { body, error, msg } = await downloadFromUrl(url);

  if (error) {
    console.log("Error downloading", error, msg);
    return { error: true };
  }
  const extension = path.extname(url) || ".jpg";

  let allResults: HandleCoverResult[];
  if (similarBookCover) {
    allResults = await Promise.all([void 0, handleCover(body, "small", `similar-books/${uuid()}${extension}`), void 0]);
  } else {
    const filePath = `${userId}/${uuid()}${extension}`;

    allResults = await Promise.all([
      handleCover(body, "mobile", `mobile-covers/${filePath}`),
      handleCover(body, "small", `small-covers/${filePath}`),
      handleCover(body, "medium", `medium-covers/${filePath}`)
    ]);
  }

  if (allResults.every(r => r.STATUS === "error") || allResults.every(r => r.STATUS === "invalid-size")) {
    return { success: false, status: allResults[0].STATUS };
  } else if (allResults.every(r => r.STATUS !== "success")) {
    return { success: false, status: "error" };
  }

  const [mobile, small, medium] = allResults;

  return {
    success: true,
    mobile,
    small,
    medium
  };
};
