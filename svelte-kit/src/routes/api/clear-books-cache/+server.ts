import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { json } from "@sveltejs/kit";

export async function POST({ cookies }: any) {
  updateCacheCookie(cookies, BOOKS_CACHE);

  return json({});
}
