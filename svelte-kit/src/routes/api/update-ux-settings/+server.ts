import { json } from "@sveltejs/kit";
import { updateUxState, type UxState } from "$lib/util/uxState.js";

export async function POST({ url, locals, cookies, request }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  const uxState = (await request.json()) as UxState;
  const { initialChart } = uxState;

  updateUxState(cookies, { initialChart });

  return json({});
}
