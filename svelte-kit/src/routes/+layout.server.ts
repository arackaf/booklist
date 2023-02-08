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

    await client.db("my-library").command({ ping: 1 });

    const start2 = +new Date();

    const x = await client
      .db("my-library")
      .collection("books")
      .aggregate([{ $match: { userId: "573d1b97120426ef0078aa92" } }, { $limit: 10 }])
      .toArray();
    const end2 = +new Date();
    console.log("Time 2 for books query", end2 - start2);

    console.log({ x: x[0]?.title });

    console.log("Success connecting");
  } catch (err) {
    console.log("Error", err);
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
