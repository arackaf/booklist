import type { DynamoUser, Subject, Tag } from "$data/types";
import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";

import { getUser } from "$data/user";
import { getPublicId } from "$lib/util/getPublicId";

import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";
const { ADMIN_USER } = env;

const redirectLookup = {
  "573d1b97120426ef0078aa92": "106394015208813116232"
};

export async function load({ locals, request, fetch }: any) {
  const publicUserId = getPublicId(request);

  let isPublic = false;
  let publicUser: DynamoUser | null = null;

  const session = await locals.getSession();
  let activeUserId = publicUserId || session?.userId;
  const isAdminUser = session?.userId === ADMIN_USER;

  let tags: Promise<Tag[]> | Tag[] = allTags(activeUserId);
  let subjects: Promise<Subject[]> | Subject[] = allSubjects(activeUserId);
  let forceLogout = !!session?.userId && session?.ver !== "2";
  const colors = fetch("/api/colors").then((resp: any) => resp.json());

  if (publicUserId) {
    publicUser = await getUser(publicUserId);

    if (!publicUser || !publicUser.isPublic) {
      tags = [];
      subjects = [];
    } else {
      isPublic = true;

      const lookupRedirectUserId = redirectLookup[publicUserId];
      if (lookupRedirectUserId) {
        const newUrl = new URL(request.url);
        newUrl.searchParams.set("user", lookupRedirectUserId);
        return redirect(308, newUrl.toString());
      }
    }
  }

  return {
    isAdminUser,
    isPublic,
    forceLogout,
    hasPublicId: !!publicUserId,
    publicUser,
    colors: await colors,
    subjects: await subjects,
    tags: await tags
  };
}
