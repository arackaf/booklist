import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { DESKTOP_REQUESTED_COOKIE } from "$lib/util/constants";
import { getUxState } from "$lib/util/uxState";

export async function load({ locals, isDataRequest, request, cookies, depends }: any) {
  depends("app-root");

  const userAgent = request.headers.get("User-Agent");
  const isMobile = true || /mobile/i.test(userAgent);

  const uxState = getUxState(cookies);

  const initialRequest = !isDataRequest;
  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE);
  }

  const session = await locals.getSession();
  const loggedIn = !!session?.user;

  return {
    uxState,
    isMobile,
    showMobile: isMobile && !uxState.desktopRequested,
    loggedIn,
    userId: session?.userId
  };
}
