import { json } from "@sveltejs/kit";

import { GET_RECOMMENDATIONS_LAMBDA } from "$env/static/private";
import { invokeLambda } from "$lib/lambda-utils.js";

export async function POST({ locals, request }) {
  const session = await locals.getSession();
  if (!session) {
    return json({ success: false });
  }
  const { userId } = session;

  const reqBody = await request.json();
  const { bookIds } = reqBody;

  try {
    const respJson = await invokeLambda(GET_RECOMMENDATIONS_LAMBDA, { userId, bookIds });

    return json(respJson);
  } catch (er) {
    console.log("Error invoking lambda", er);
    return json({ error: true });
  }
}
