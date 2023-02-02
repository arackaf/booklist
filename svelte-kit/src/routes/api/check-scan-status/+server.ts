import { json } from "@sveltejs/kit";

import { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, CHECK_SCAN_STATUS_LAMBDA } from "$env/static/private";

export async function POST({ locals }: any) {
  const session = await locals.getSession();
  if (!session) {
    return { success: false };
  }

  const { userId } = session;

  return json({});
}
