import { BOOKS_CACHE, bustCache } from "$lib/state/cacheHelpers";

export async function load({ locals, isDataRequest, cookies }: any) {
  const initialRequest = !isDataRequest;
  if (initialRequest) {
    bustCache(cookies, BOOKS_CACHE);
  }

  const session = await locals.getSession();
  const loggedIn = !!session?.user;

  return {
    loggedIn
  };
}
