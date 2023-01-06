import { json } from "@sveltejs/kit";
import { DESKTOP_REQUESTED_COOKIE } from "$lib/util/constants";

export async function GET({ cookies }: any) {
  cookies.set(DESKTOP_REQUESTED_COOKIE, "1", { path: "/" });

  return json({});
}
