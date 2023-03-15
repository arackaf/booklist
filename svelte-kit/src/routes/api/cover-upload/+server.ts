import { v4 } from "uuid";

import { toUtf8, fromUtf8 } from "@aws-sdk/util-utf8";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { json } from "@sveltejs/kit";

import { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, PROCESS_COVER_LAMBDA } from "$env/static/private";

function getExtension(name: string) {
  const ext = name.lastIndexOf(".");

  if (ext < 0) {
    return "";
  }
  return name.slice(ext);
}

export async function POST({ locals, request }) {
  const session = await locals.getSession();
  if (!session) {
    return json({ error: true });
  }

  const reqBody = await request.formData();
  const file = reqBody.get("fileUploaded") as any;
  const filename = reqBody.get("filename")!.toString();

  const extension = getExtension(filename) || ".jpg";
  const uploadKey = `upload-staging/${v4()}${extension}`;

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

    await s3
      .send(
        new PutObjectCommand({
          Bucket: "my-library-cover-uploads",
          Key: uploadKey,
          Body: arrayBuffer
        })
      )
      .catch(err => {
        console.log("Error putting into S3", { err });
      });

    const url = `https://s3.amazonaws.com/my-library-cover-uploads/${uploadKey}`;

    const command = new InvokeCommand({
      FunctionName: PROCESS_COVER_LAMBDA,
      Payload: fromUtf8(JSON.stringify({ url, userId: session.userId }))
    });
    const response = await client.send(command);

    if (response.Payload) {
      const respJson = JSON.parse(toUtf8(response.Payload));

      return json(respJson);
    } else {
      return json({ error: true });
    }
  } catch (er) {
    console.log("Error invoking lambda", er);
    return json({ error: true });
  }
}
