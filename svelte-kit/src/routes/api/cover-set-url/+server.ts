import { json } from "@sveltejs/kit";

import { PROCESS_COVER_LAMBDA } from "$env/static/private";
import { invokeLambda } from "$lib/lambda-utils.js";

export async function POST({ locals, request }) {
  const session = await locals.getSession();
  if (!session) {
    return json({ success: false });
  }

  const reqBody = await request.json();

  const { url } = reqBody;
  const { userId } = session;

  try {
    const respJson = await invokeLambda(PROCESS_COVER_LAMBDA, { url, userId });

    return json(respJson);
  } catch (er) {
    console.log("Error invoking lambda", er);
    return json({ error: true });
  }
}
