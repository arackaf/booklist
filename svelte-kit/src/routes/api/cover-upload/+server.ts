import path from "path";
import uuid from "uuid";

import { toUtf8, fromUtf8 } from "@aws-sdk/util-utf8-node";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import { json } from "@sveltejs/kit";

import { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, UPLOAD_FROM_URL_LAMBDA } from "$env/static/private";

export async function POST({ cookies, locals, request }: any) {
  const session = await locals.getSession();
  if (!session) {
    return json({ error: true });
  }

  const reqBody = await request.formData();
  const file = reqBody.get("fileUploaded");
  const filename = reqBody.get("filename");

  const extension = path.extname(filename) || ".jpg";
  const uploadKey = `upload-staging/${uuid.v4()}${extension}`;

  try {
    const client = new LambdaClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: AMAZON_ACCESS_KEY,
        secretAccessKey: AMAZON_SECRET_KEY
      }
    });

    const s3 = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: AMAZON_ACCESS_KEY,
        secretAccessKey: AMAZON_SECRET_KEY
      }
    });

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    await s3
      .send(
        new PutObjectCommand({
          Bucket: "my-library-cover-uploads",
          Key: uploadKey,
          Body: fileBuffer
        })
      )
      .catch(err => {
        console.log({ err });
      });

    const url = `https://s3.amazonaws.com/my-library-cover-uploads/${uploadKey}`;

    const command = new InvokeCommand({
      FunctionName: UPLOAD_FROM_URL_LAMBDA,
      Payload: fromUtf8(JSON.stringify({ url, userId: session.userId }))
    });
    const response = await client.send(command);

    await s3
      .send(
        new DeleteObjectCommand({
          Bucket: "my-library-cover-uploads",
          Key: uploadKey
        })
      )
      .catch(err => {
        console.log({ err });
      });

    if (response.Payload) {
      const respJson = JSON.parse(toUtf8(response.Payload));

      return json(respJson);
    } else {
      return json({ error: true });
    }
  } catch (er) {
    console.log("Error invoking lambda", er);
  }

  return json({});
}
