import { redirect } from "@sveltejs/kit";

import type { DynamoUser } from "$data/types";
import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";
import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";
import { getUser } from "$data/user";

export async function load({ cookies, locals, depends, isDataRequest, url }: any) {
  const initialRequest = !isDataRequest;

  const publicUserId = url.searchParams.get("user");
  let publicUser: DynamoUser | null = null;

  const session = await locals.getSession();

  if (!session?.user && !publicUserId) {
    throw redirect(302, "/");
  }

  let activeUserId = session?.userId;
  if (publicUserId) {
    publicUser = await getUser(publicUserId);

    if (!publicUser || !publicUser.isPublic) {
      activeUserId = "";
    } else {
      activeUserId = publicUserId;
    }
  }

  const booksCache = initialRequest ? +new Date() : cookies.get(BOOKS_CACHE);

  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE, booksCache);
  }

  depends("reload-root-data");

  const tags = allTags(activeUserId);
  const subjects = allSubjects(activeUserId);

  return {
    activeUserId,
    booksCache,
    ...(await subjects),
    ...(await tags)
  };
}
