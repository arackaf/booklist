import { redirect } from "@sveltejs/kit";

import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";
import { BOOKS_CACHE, updateCacheCookie } from "$lib/state/cacheHelpers";

export async function load({ cookies, locals, depends, isDataRequest }: any) {
  const session = await locals.getSession();

  if (!session?.user) {
    throw redirect(302, "/");
  }

  const initialRequest = !isDataRequest;
  if (initialRequest) {
    updateCacheCookie(cookies, BOOKS_CACHE);
  }

  depends("reload-subjects");
  depends("reload-tags");

  const subjects = allSubjects(session.userId);
  const tags = allTags(session.userId);

  return {
    subjects,
    tags
  };
}
