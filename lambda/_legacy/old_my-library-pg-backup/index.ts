import fs from "fs";
import path from "path";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = "us-east-1";
const params = {
  Bucket: "my-library-backups",
  Key: "my-file-2",
  Body: fs.readFileSync(path.resolve(__dirname, "dump-output.sql"))
};

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ID!,
    secretAccessKey: process.env.AWS_SECRET!
  }
});

s3.send(new PutObjectCommand(params))
  .then(() => {
    console.log("Uploaded!");
  })
  .catch(err => {
    console.log("Error: ", err);
  });
