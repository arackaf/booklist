import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { getUxState } from "$lib/util/uxState";

import mysql from "mysql2";

export async function load({ locals, isDataRequest, request, cookies, depends }: any) {
  depends("app:root");

  console.log("typeof mysql", typeof mysql, typeof mysql?.createConnection);

  const userAgent = request.headers.get("User-Agent");
  const isMobile = /mobile/i.test(userAgent);

  const uxState = getUxState(cookies);

  const initialRequest = !isDataRequest;
  const booksCache = initialRequest ? +new Date() : cookies.get(BOOKS_CACHE);

  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE, booksCache);
  }

  return {
    uxState,
    isMobile,
    booksCache,
    showMobile: isMobile && uxState.desktopRequested !== "1"
  };
}
