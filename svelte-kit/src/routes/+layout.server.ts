import { BOOKS_CACHE, bustCache } from "$lib/state/cacheHelpers";

export async function load({ locals, isDataRequest, request, cookies, ...rest }: any) {
  const userAgent = request.headers.get("User-Agent");
  const isMobile = false || /mobile/i.test(userAgent);

  const initialRequest = !isDataRequest;
  if (initialRequest) {
    bustCache(cookies, BOOKS_CACHE);
  }

  const session = await locals.getSession();
  const loggedIn = !!session?.user;

  return {
    isMobile,
    loggedIn
  };
}
