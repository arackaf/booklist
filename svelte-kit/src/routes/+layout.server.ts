import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { getUxState } from "$lib/util/uxState";
import type { Login } from "$lib/types";

export async function load({ locals, isDataRequest, request, cookies, depends }) {
  depends("app:root");

  const userAgent = request.headers.get("User-Agent")!;
  const isMobile = /mobile/i.test(userAgent);

  const uxState = getUxState(cookies);

  const initialRequest = !isDataRequest;
  const booksCache = initialRequest ? +new Date() : cookies.get(BOOKS_CACHE);

  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE, booksCache);
  }

  let loggedInUser: Login | null = null;

  return {
    loggedIn: false,
    loggedInUser,
    userId: "",
    uxState,
    isMobile,
    booksCache,
    showMobile: isMobile && uxState.desktopRequested !== "1"
  };
}
