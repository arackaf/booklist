import { json } from "@sveltejs/kit";

import { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, GET_RECOMMENDATIONS_LAMBDA } from "$env/static/private";

export async function POST({ locals, request }: any) {
  const session = await locals.getSession();
  if (!session) {
    return { success: false };
  }
  const { userId } = session;

  const reqBody = await request.json();
  const { bookIds } = reqBody;

  try {
    return json({});
  } catch (er) {
    console.log("Error invoking lambda", er);
    return json({ error: true });
  }
}
