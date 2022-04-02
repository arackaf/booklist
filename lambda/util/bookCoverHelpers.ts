const S3 = require("aws-sdk/clients/s3");

import { defaultMetaData } from "./s3MetaData";

const GOOGLE_LIBRARY_KEY = process.env.GOOGLE_LIBRARY_KEY;

export const getOpenLibraryCoverUri = isbn => `http://covers.openlibrary.org/b/ISBN/${isbn}-M.jpg`;
export const getGoogleLibraryUri = (isbn, GOOGLE_LIBRARY_KEY) =>
  `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_LIBRARY_KEY}`;

export function saveContentToS3(content, s3Key) {
  return new Promise(res => {
    let s3bucket = new S3({ params: { Bucket: "my-library-cover-uploads" } });

    let params: any = {
      Key: s3Key,
      Body: content,
      ...defaultMetaData
    };

    s3bucket.upload(params, function (err) {
      if (err) {
        console.log("Error uploading to S3", { s3Key, err });
        res(err);
      } else {
        console.log("S3 File Saved");
        res(`https://my-library-cover-uploads.s3.amazonaws.com/${params.Key}`);
      }
    });
  });
}
