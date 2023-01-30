import { json } from "@sveltejs/kit";
import { updateUxState } from "$lib/util/uxState";

export async function GET({ cookies }: any) {
  updateUxState(cookies, { desktopRequested: "0" });

  return json({});
}
