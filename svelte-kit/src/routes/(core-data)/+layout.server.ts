import type { DynamoUser } from "$data/types";
import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";

import { getUser } from "$data/user";

export async function load({ locals, request, fetch }: any) {
  // do NOT use the url arg that comes with the loader, since we don't want this to re-run whenever the url changes
  const requestUrl = new URL(request.url);
  const publicUserId = requestUrl.searchParams.get("user");

  let isPublic = false;
  let publicUser: DynamoUser | null = null;
  let publicName: string | null = null;
  let publicBooksHeader: string | null = null;

  const session = await locals.getSession();
  let activeUserId = publicUserId || session?.userId;

  const tags = allTags(activeUserId);
  const subjects = allSubjects(activeUserId);
  const colors = fetch("/api/colors").then((resp: any) => resp.json());

  if (publicUserId) {
    publicUser = await getUser(publicUserId);

    if (!publicUser || !publicUser.isPublic) {
    } else {
      isPublic = true;
      publicName = publicUser.publicName;
      publicBooksHeader = publicUser.publicBooksHeader;
    }
  }

  return {
    isPublic,
    publicName,
    publicBooksHeader,
    colors,
    loggedIn: !!session?.user,
    userId: session?.userId,
    subjects,
    tags
  };
}
