import path from "path";
import { v4 as uuid } from "uuid";

import downloadFromUrl from "./downloadFromUrl";
import { HandleCoverResult, handleCover } from "./handleCover";

export async function attemptSimilarBookCover(url: string, minLength = null): Promise<HandleCoverResult> {
  try {
    const { body, error } = await downloadFromUrl(url);

    if (error || !body) {
      return { STATUS: "error" };
    }

    if (minLength != null && body.byteLength < minLength) {
      return { STATUS: "error" };
    }

    const extension = path.extname(url) || ".jpg";
    const filePath = `similar-books/${uuid()}${extension}`;

    let result = await handleCover(body, "small", filePath);
    return result;
  } catch (er) {
    return { STATUS: "error" };
  }
}
