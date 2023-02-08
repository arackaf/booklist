import { redirect } from "@sveltejs/kit";

import type { DynamoUser } from "$data/types";
import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";

import { getUser } from "$data/user";

export async function load({ cookies, locals, parent, isDataRequest, request }: any) {
  const initialRequest = !isDataRequest;

  // do NOT use the url arg that comes with the loader, since we don't want this to re-run whenever the url changes
  const requestUrl = new URL(request.url);
  const publicUserId = requestUrl.searchParams.get("user");

  let isPublic = false;
  let publicUser: DynamoUser | null = null;
  let publicName: string | null = null;
  let publicBooksHeader: string | null = null;

  const session = await locals.getSession();

  let activeUserId = session?.userId;
  if (publicUserId) {
    publicUser = await getUser(publicUserId);

    if (!publicUser || !publicUser.isPublic) {
      activeUserId = "";
    } else {
      isPublic = true;
      activeUserId = publicUserId;
      publicName = publicUser.publicName;
      publicBooksHeader = publicUser.publicBooksHeader;
    }
  }

  const tags = allTags(activeUserId);
  const subjects = allSubjects(activeUserId);

  return {
    isPublic,
    publicName,
    publicBooksHeader,
    ...(await subjects),
    ...(await tags)
  };
}
