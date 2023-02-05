import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defaultMetaData } from "./s3MetaData";

const GOOGLE_LIBRARY_KEY = process.env.GOOGLE_LIBRARY_KEY;

export const getOpenLibraryCoverUri = isbn => `http://covers.openlibrary.org/b/ISBN/${isbn}-M.jpg`;
export const getGoogleLibraryUri = (isbn, GOOGLE_LIBRARY_KEY) =>
  `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_LIBRARY_KEY}`;

export function saveContentToS3(content, s3Key) {
  return new Promise(res => {
    let s3bucket = new S3Client({ region: "us-east-1" });

    let params = new PutObjectCommand({
      Bucket: "my-library-cover-uploads",
      Key: s3Key,
      Body: content,
      ...defaultMetaData
    });

    s3bucket.send(params, function (err) {
      if (err) {
        console.log("Error uploading to S3", { s3Key, err });
        res(err);
      } else {
        console.log("S3 File Saved");
        // @ts-ignore
        res(`https://my-library-cover-uploads.s3.amazonaws.com/${params.Key}`);
      }
    });
  });
}
