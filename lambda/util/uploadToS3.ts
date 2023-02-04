import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defaultMetaData } from "./s3MetaData";

type S3UploadResult = { STATUS: "error"; message: any } | { STATUS: "success"; url: string };

const Bucket = "my-library-cover-uploads";

export default (fileName, body) => {
  const s3 = new S3Client({ region: "us-east-1" });
  const key = fileName;
  var params = new PutObjectCommand({ Bucket, Key: key, Body: body, ...defaultMetaData });

  return new Promise<S3UploadResult>(res => {
    s3.send(params, function (err, data) {
      if (err) {
        return res({ STATUS: "error", message: err });
      }
      res({ STATUS: "success", url: `https://${Bucket}.s3.amazonaws.com/${key}` });
    });
  });
};
