import { json } from "@sveltejs/kit";
import { DESKTOP_REQUESTED_COOKIE } from "$lib/util/constants";

export async function GET({ cookies }: any) {
  cookies.delete(DESKTOP_REQUESTED_COOKIE, { path: "/" });

  return json({});
}
