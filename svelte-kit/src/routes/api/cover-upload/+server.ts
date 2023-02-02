import { v4 } from "uuid";

import { json } from "@sveltejs/kit";

import { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, UPLOAD_FROM_URL_LAMBDA } from "$env/static/private";

function getExtension(name: string) {
  const ext = name.lastIndexOf(".");

  if (ext < 0) {
    return "";
  }
  return name.slice(ext);
}

export async function POST({ cookies, locals, request }: any) {
  const session = await locals.getSession();
  if (!session) {
    return json({ error: true });
  }

  const reqBody = await request.formData();
  const file = reqBody.get("fileUploaded");
  const filename = reqBody.get("filename");

  const extension = getExtension(filename) || ".jpg";
  const uploadKey = `upload-staging/${v4()}${extension}`;

  try {
    return json({});
  } catch (er) {
    console.log("Error invoking lambda", er);
  }

  return json({});
}
