import path from "path";
import uuid from "uuid/v4";

import checkLogin from "../util/checkLoginToken";
import resizeImage from "../util/resizeImage";
import corsResponse from "../util/corsResponse";
import uploadToS3 from "../util/uploadToS3";
import downloadFromUrl from "../util/downloadFromUrl";
import { isWarmingCall } from "../util/isWarmingCall";

export const handler = async event => {
  if (isWarmingCall(event)) {
    return corsResponse({ coldStartPrevented: true });
  }

  const { userId, loginToken, size, url } = JSON.parse(event.body);
  const MAX_WIDTH = size == "small" ? 50 : size == "medium" ? 106 : 200;

  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({});
  }
  const resp = await downloadFromUrl(url);

  if ("error" in resp) {
    return corsResponse({ error: true, msg: resp.msg });
  }

  const imageResult = await resizeImage(resp.body, MAX_WIDTH);
  if (imageResult.error || !imageResult.body) {
    return corsResponse({ error: true });
  }

  const newName = `bookCovers/${userId}/${uuid()}${path.extname(url) || ".jpg"}`;
  const s3Result = await uploadToS3(newName, imageResult.body);
  return corsResponse(s3Result);
};
