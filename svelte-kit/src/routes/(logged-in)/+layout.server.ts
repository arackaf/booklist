import { redirect } from "@sveltejs/kit";

import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";

export async function load({ locals, fetch }: any) {
  const session = await locals.getSession();

  if (!session?.user) {
    throw redirect(302, "/");
  }

  const subjects = allSubjects(session.userId);
  const tags = allTags(session.userId);

  return {
    subjects,
    tags
  };
}
