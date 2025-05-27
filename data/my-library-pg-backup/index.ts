import fs from "fs";
import path from "path";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const numToDisplay = (num: number) => num.toString().padStart(2, "0");

const today = new Date();
const date = `${today.getFullYear()}/${numToDisplay(today.getMonth() + 1)}/${numToDisplay(today.getDate())}`;
const time = `${today.getHours()}-${numToDisplay(today.getMinutes())}-${numToDisplay(today.getSeconds())}`;
const filename = `${date}/${time}`;

const REGION = "us-east-1";
const dumpParams = {
  Bucket: "my-library-backups",
  Key: `${filename}.dump`,
  Body: fs.readFileSync(path.resolve(__dirname, "backup.dump"))
};
const sqlParams = {
  Bucket: "my-library-backups",
  Key: `${filename}.sql`,
  Body: fs.readFileSync(path.resolve(__dirname, "backup.sql"))
};

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ID!,
    secretAccessKey: process.env.AWS_SECRET!
  }
});

s3.send(new PutObjectCommand(sqlParams))
  .then(() => {
    console.log("SQL Backup Uploaded!");
  })
  .catch(err => {
    console.log("Error: ", err);
  });

s3.send(new PutObjectCommand(dumpParams))
  .then(() => {
    console.log("Dump Backup Uploaded!");
  })
  .catch(err => {
    console.log("Error: ", err);
  });
