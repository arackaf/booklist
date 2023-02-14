import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { parseUserAgent } from "$lib/util/parseUserAgent";
import { getUxState } from "$lib/util/uxState";

export async function load({ locals, isDataRequest, request, cookies, depends }: any) {
  depends("app:root");

  const { isMobile } = parseUserAgent(request);
  const uxState = getUxState(cookies);

  const initialRequest = !isDataRequest;
  const booksCache = initialRequest ? +new Date() : cookies.get(BOOKS_CACHE);

  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE, booksCache);
  }

  const session = await locals.getSession();
  return {
    loggedIn: !!session?.user,
    userId: session?.userId,
    uxState,
    isMobile,
    booksCache,
    showMobile: isMobile && uxState.desktopRequested !== "1"
  };
}
