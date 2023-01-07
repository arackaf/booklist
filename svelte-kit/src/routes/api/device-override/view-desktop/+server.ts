import { json } from "@sveltejs/kit";
import { DESKTOP_REQUESTED_COOKIE, ONE_YEAR_SECONDS } from "$lib/util/constants";

export async function GET({ cookies }: any) {
  cookies.set(DESKTOP_REQUESTED_COOKIE, "1", { path: "/", maxAge: ONE_YEAR_SECONDS });

  return json({});
}
