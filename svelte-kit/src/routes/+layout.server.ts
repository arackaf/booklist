import { MONGO_CONNECTION } from "$env/static/private";
import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { getUxState } from "$lib/util/uxState";

import { MongoClient } from "mongodb";

async function connect() {
  const start = +new Date();
  const client = new MongoClient(MONGO_CONNECTION);
  try {
    await client.connect();
    const end = +new Date();
    console.log("Time", end - start);

    await client.db("books").command({ ping: 1 });

    console.log("Success");
  } catch (err) {
  } finally {
    await client.close();
  }
}

export async function load({ locals, isDataRequest, request, cookies, depends }: any) {
  depends("app:root");

  try {
    await connect();
  } catch (er) {}

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
