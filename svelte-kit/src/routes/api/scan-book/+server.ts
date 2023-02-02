import { json } from "@sveltejs/kit";

import { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, SCAN_BOOK_LAMBDA } from "$env/static/private";

export async function POST({ cookies, locals, request }: any) {
  const session = await locals.getSession();
  if (!session) {
    return { success: false };
  }

  const reqBody = await request.json();

  const { isbn } = reqBody;
  const { userId } = session;

  try {
    return json({});
  } catch (er) {
    console.log("Error invoking lambda", er);
    return json({ error: true });
  }
}
