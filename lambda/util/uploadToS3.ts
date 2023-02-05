import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defaultMetaData } from "./s3MetaData";

type S3UploadResult = { success: false; message: any } | { success: true; url: string };

const Bucket = "my-library-cover-uploads";

export const uploadToS3 = (fileName, body) => {
  const s3 = new S3Client({ region: "us-east-1" });
  const key = fileName;
  var params = new PutObjectCommand({ Bucket, Key: key, Body: body, ...defaultMetaData });

  return new Promise<S3UploadResult>(res => {
    s3.send(params, function (err, data) {
      if (err) {
        return res({ success: false, message: err });
      }
      res({ success: true, url: `https://${Bucket}.s3.amazonaws.com/${key}` });
    });
  });
};
