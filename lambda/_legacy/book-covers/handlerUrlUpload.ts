import path from "path";
import uuid from "uuid/v4";

import checkLogin from "../../util/checkLoginToken";
import { handleCover, HandleCoverResult } from "../../util/handleCover";
import corsResponse from "../../util/corsResponse";

import downloadFromUrl from "../../util/downloadFromUrl";
import { isWarmingCall } from "../../util/isWarmingCall";

export const handler = async event => {
  if (isWarmingCall(event)) {
    return corsResponse({ coldStartPrevented: true });
  }

  const { userId, loginToken, url, similarBookCover = false } = JSON.parse(event.body);

  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({});
  }
  const { body, error } = await downloadFromUrl(url);

  if (error) {
    console.log("Error downloading", error);
    return corsResponse({ error: true });
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

  const success = allResults.filter(x => x).every(r => r.STATUS === "success");
  const [mobile, small, medium] = allResults;

  return corsResponse({
    success,
    mobile,
    small,
    medium
  });
};
