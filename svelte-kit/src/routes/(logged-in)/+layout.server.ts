import { redirect } from "@sveltejs/kit";

import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";

export async function load({ parent }: any) {
  const { session } = await parent();
  if (!session?.user) {
    throw redirect(302, "/");
  }

  const subjects = allSubjects();
  const tags = allTags();

  return {
    subjects,
    tags
  };
}
