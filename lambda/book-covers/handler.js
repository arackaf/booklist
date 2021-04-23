import path from "path";
import uuid from "uuid/v4";
import request from "request";
import awsMultiPartParser from "lambda-multipart-parser";

import updateBookSummaryCovers from "./updateBookSummaryCovers";

import checkLogin from "../util/checkLoginToken";
import resizeImage from "../util/resizeImage";
import corsResponse from "../util/corsResponse";
import uploadToS3 from "../util/uploadToS3";
import downloadFromUrl from "../util/downloadFromUrl";
import getSecrets from "../util/getSecrets";

export const upload = async event => {
  const formPayload = await awsMultiPartParser.parse(event);
  const { userId, loginToken, size } = formPayload;
  const file = formPayload.files[0];
  const MAX_WIDTH = size == "small" ? 50 : size == "medium" ? 106 : 200;

  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({});
  }

  const imageResult = await resizeImage(file.content, MAX_WIDTH);

  if (imageResult.error || !imageResult.body) {
    return corsResponse({ error: true });
  }
  const newName = `bookCovers/${userId}/${uuid()}${path.extname(file.filename) || ".jpg"}`;
  const s3Result = await uploadToS3(newName, imageResult.body);
  return corsResponse(s3Result);
};

export const uploadFromUrl = async event => {
  const { userId, loginToken, size, url } = JSON.parse(event.body);
  const MAX_WIDTH = size == "small" ? 50 : size == "medium" ? 106 : 200;

  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({});
  }
  const { body, error } = await downloadFromUrl(url);

  const imageResult = await resizeImage(body, MAX_WIDTH);
  if (imageResult.error || !imageResult.body) {
    return corsResponse({ error: true });
  }

  const newName = `bookCovers/${userId}/${uuid()}${path.extname(url) || ".jpg"}`;
  const s3Result = await uploadToS3(newName, imageResult.body);
  return corsResponse(s3Result);
};

export const isbnDbBookCoverLookup = async event => {
  const secrets = await getSecrets();
  const key = secrets["isbn-db-key"];
  const { isbn } = JSON.parse(event.body);

  const result = await new Promise(resolve => {
    request.get(
      `https://api2.isbndb.com/book/${isbn}`,
      {
        headers: {
          Authorization: key
        }
      },
      (a, b, body) => {
        const result = {};
        try {
          const bookResult = JSON.parse(body);
          console.log("Found", bookResult);

          if (bookResult && bookResult.book && bookResult.book.image) {
            result.image = bookResult.book.image;
          }
        } catch (er) {
          console.log("Error", er);
        }
        resolve(result);
      }
    );
  });

  return corsResponse({ result });
};

export const bookRecommendationBadCoverSync = async event => {
  await updateBookSummaryCovers();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Done!" })
  };
};
