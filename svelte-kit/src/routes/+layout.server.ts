import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { getUxState } from "$lib/util/uxState";

export async function load({ locals, isDataRequest, request, cookies, depends }: any) {
  depends("app:root");

  console.log("typeof global", typeof global);

  const userAgent = request.headers.get("User-Agent");
  const isMobile = /mobile/i.test(userAgent);

  const uxState = getUxState(cookies);

  // do NOT use the url arg that comes with the loader, since we don't want this to re-run whenever the url changes
  const requestUrl = new URL(request.url);

  const publicUserId = requestUrl.searchParams.get("user");

  const initialRequest = !isDataRequest;
  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE);
  }

  const session = await locals.getSession();
  const loggedIn = !!session?.user;

  return {
    uxState,
    isMobile,
    showMobile: isMobile && uxState.desktopRequested !== "1",
    loggedIn,
    hasPublicUserId: !!publicUserId,
    userId: session?.userId
  };
}
