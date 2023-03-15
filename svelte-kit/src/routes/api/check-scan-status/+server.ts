import { json } from "@sveltejs/kit";

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { toUtf8, fromUtf8 } from "@aws-sdk/util-utf8";

import { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, CHECK_SCAN_STATUS_LAMBDA } from "$env/static/private";

export async function POST({ locals }) {
  const session = await locals.getSession();
  if (!session) {
    return json({ success: false });
  }

  const { userId } = session;

  try {
    const client = new LambdaClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: AMAZON_ACCESS_KEY,
        secretAccessKey: AMAZON_SECRET_KEY
      }
    });
    const command = new InvokeCommand({
      FunctionName: CHECK_SCAN_STATUS_LAMBDA,
      Payload: fromUtf8(JSON.stringify({ userId }))
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
