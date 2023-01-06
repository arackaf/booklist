import { BOOKS_CACHE, bustCache } from "$lib/state/cacheHelpers";
import { setIsMobile } from "$lib/state/screen";

export async function load({ locals, isDataRequest, request, cookies, ...rest }: any) {
  const userAgent = request.headers.get("User-Agent");
  const isMobile = /mobile/i.test(userAgent);

  setIsMobile(isMobile);

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
