import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
const { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, PROCESS_COVER_LAMBDA } = env;

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";

import { invokeLambda } from "$lib/lambda-utils.js";

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
    const respJson = await invokeLambda(PROCESS_COVER_LAMBDA, { url, userId: session.userId });

    return json(respJson);
  } catch (er) {
    console.log("Error invoking lambda", er);
    return json({ error: true });
  }
}
