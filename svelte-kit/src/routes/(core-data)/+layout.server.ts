import type { DynamoUser, Subject, Tag } from "$data/types";
import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";

import { getUser } from "$data/user";
import { getPublicId } from "$lib/util/getPublicId";

import { ADMIN_USER } from "$env/static/private";
import type { Login } from "$lib/types";

export async function load({ locals, request, fetch }: any) {
  const publicUserId = getPublicId(request);

  let isPublic = false;
  let publicUser: DynamoUser | null = null;

  const session = await locals.getSession();
  let activeUserId = publicUserId || session?.userId;
  const isAdminUser = session?.userId === ADMIN_USER;

  let tags: Promise<Tag[]> | Tag[] = allTags(activeUserId);
  let subjects: Promise<Subject[]> | Subject[] = allSubjects(activeUserId);
  const colors = fetch("/api/colors").then((resp: any) => resp.json());

  if (publicUserId) {
    publicUser = await getUser(publicUserId);

    if (!publicUser || !publicUser.isPublic) {
      tags = [];
      subjects = [];
    } else {
      isPublic = true;
    }
  }

  let loggedInUser: Login | null = null;

  if (session?.user) {
    loggedInUser = {
      ...session!.user,
      provider: session.provider
    };
  }

  return {
    isAdminUser,
    isPublic,
    hasPublicId: !!publicUserId,
    publicUser,
    colors: await colors,
    subjects: await subjects,
    tags: await tags,
    loggedInUser
  };
}
