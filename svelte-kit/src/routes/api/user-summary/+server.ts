import { json } from "@sveltejs/kit";
import { userSummary } from "$data/user-summary.js";

export async function GET({ url, locals }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  const userId = session.userId;
  const userSummaryResult = await userSummary(userId);

  return json(userSummaryResult);
}
