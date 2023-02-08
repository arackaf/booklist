import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { getUxState } from "$lib/util/uxState";

export async function load({ locals, isDataRequest, request, cookies, depends }: any) {
  depends("app:root");

  console.log("typeof global", typeof global);

  const userAgent = request.headers.get("User-Agent");
  const isMobile = /mobile/i.test(userAgent);

  const uxState = getUxState(cookies);

  const initialRequest = !isDataRequest;
  if (initialRequest) {
    global.initialBooksCache = +new Date();
    updateCacheCookie(cookies, BOOKS_CACHE, global.initialBooksCache);
  }

  return {
    uxState,
    isMobile,
    showMobile: isMobile && uxState.desktopRequested !== "1"
  };
}
