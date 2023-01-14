import { redirect } from "@sveltejs/kit";

import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";
import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { db, getQueryPacket } from "$data/dynamoHelpers";

async function getDynamoTags(consistent: boolean = false) {
  const start = +new Date();
  const res = await db.query(
    getQueryPacket(`pk = :pk`, {
      ExpressionAttributeValues: { ":pk": "tag#1" },
      ...(consistent ? { ConsistentRead: true } : {})
    })
  );
  const end = +new Date();
  console.log("Dynamo tags time", { consistent }, end - start);
  // console.log({ dynamoTags: res });
  return res;
}

export async function load({ cookies, locals, depends, isDataRequest }: any) {
  const initialRequest = !isDataRequest;

  const session = await locals.getSession();

  if (!session?.user) {
    throw redirect(302, "/");
  }

  const booksCache = initialRequest ? +new Date() : cookies.get(BOOKS_CACHE);

  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE, booksCache);
  }

  depends("reload-root-data");

  const subjects = allSubjects(session.userId);
  const tags = allTags(session.userId);

  return {
    booksCache,
    subjects,
    tags,
    dynamoTags: getDynamoTags(),
    dynamoTags2: getDynamoTags(true)
  };
}
