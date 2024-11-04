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

// pg_dump postgresql://user:pws@my-db.fly.dev:5432/my-library -Fc > my-db.dump

// PGPASSWORD=docker pg_restore -h localhost -U docker -d my-db-2 my-db.dump

// ---------------

// PGPASSWORD=docker createdb -T template0 my-library -h localhost -U docker
// PGPASSWORD=docker pg_restore -h localhost -U docker -C -d my-library my-db.dump

// postgres://postgres:XUO8JiquQ8d12qq@db-restore-test.flycast:5432

// PGPASSWORD=XUO8JiquQ8d12qq pg_restore -h localhost -U postgres -C -d postgres my-db.dump
// PGPASSWORD=JJxxXDx9Ho9mXzK pg_restore -h localhost -U postgres -C -d postgres my-db.dump

// LATEST
// PGPASSWORD=oTLJc9WPKcT1hAE pg_restore -h localhost -U postgres -C -d postgres backup-dump.dump

// PGPASSWORD=WT5CT7rtu4iQfW9 psql -h localhost -U postgres -d postgres -f backup.sql
