import { redirect } from "@sveltejs/kit";

import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";
import { allLabelColors } from "$data/labelColors";

export async function load({ parent, locals }: any) {
  const session = await locals.getSession();

  if (!session?.user) {
    throw redirect(302, "/");
  }

  const subjects = allSubjects(session.userId);
  const tags = allTags(session.userId);
  const colors = allLabelColors();

  return {
    subjects,
    tags,
    colors
  };
}
