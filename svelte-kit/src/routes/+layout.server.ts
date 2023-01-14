import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { DESKTOP_REQUESTED_COOKIE } from "$lib/util/constants";

export async function load({ locals, isDataRequest, request, cookies, depends }: any) {
  depends("app-root");

  const userAgent = request.headers.get("User-Agent");
  const isMobile = true || /mobile/i.test(userAgent);

  const desktopRequested = !!cookies.get(DESKTOP_REQUESTED_COOKIE);

  const theme = cookies.get("theme") || "scheme5";
  const whiteBg = (cookies.get("wbg") || "0") == "1";

  const initialRequest = !isDataRequest;
  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE);
  }

  const session = await locals.getSession();
  const loggedIn = !!session?.user;

  return {
    theme,
    whiteBg,
    isMobile,
    desktopRequested,
    showMobile: isMobile && !desktopRequested,
    loggedIn
  };
}
