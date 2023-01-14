import { redirect } from "@sveltejs/kit";

import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";
import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";

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
    subjects,
    tags
  };
}
