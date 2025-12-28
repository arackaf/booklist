import { json } from "@sveltejs/kit";

import { env } from "$env/dynamic/private";
const { CHECK_SCAN_STATUS_LAMBDA } = env;

import { invokeLambda } from "$lib/lambda-utils.js";

export async function POST({ locals }) {
  const session = await locals.getSession();
  if (!session) {
    return json({ success: false });
  }

  const { userId } = session;

  try {
    const respJson = await invokeLambda(CHECK_SCAN_STATUS_LAMBDA, { userId });

    return json(respJson);
  } catch (er) {
    console.log("Error invoking lambda", er);
    return json({ success: false, error: true });
  }
}
