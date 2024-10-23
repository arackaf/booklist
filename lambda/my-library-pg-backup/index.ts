import fs from "fs";
import path from "path";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const junk = +new Date();

const REGION = "us-east-1";
const params = {
  Bucket: "my-library-backups",
  Key: `backup-${junk}.sql`,
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

// pg_dump postgresql://user:pws@my-db.fly.dev:5432/my-library -Fc > my-db.dump

// PGPASSWORD=docker pg_restore -h localhost -U docker -d my-db-2 my-db.dump

// ---------------

// PGPASSWORD=docker createdb -T template0 my-library -h localhost -U docker
// PGPASSWORD=docker pg_restore -h localhost -U docker -C -d my-library my-db.dump
