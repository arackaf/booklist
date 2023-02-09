import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { getUxState } from "$lib/util/uxState";
import { MY_SQL_HOST, MY_SQL_USERNAME, MY_SQL_PASSWORD, MY_SQL_DB } from "$env/static/private";

import { connect } from "@planetscale/database";
const config = {
  host: MY_SQL_HOST,
  username: MY_SQL_USERNAME,
  password: MY_SQL_PASSWORD
};

export async function load({ locals, isDataRequest, request, cookies, depends }: any) {
  depends("app:root");

  try {
    let start = +new Date();
    const conn = connect(config);
    let end = +new Date();
    console.log("Connecting time", end - start);

    start = +new Date();
    const results = await conn.execute("SELECT * FROM subjects;");
    end = +new Date();
    console.log("Query time", end - start);
    console.log("MYSQL\n\n", results.rows.length, "subjects \n\n");
  } catch (er) {
    console.log("er", er);
  }

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
