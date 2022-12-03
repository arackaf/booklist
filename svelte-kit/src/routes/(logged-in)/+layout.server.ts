import { allSubjects } from "$data/subjects";
import { allTags } from "$data/tags";

export function load() {
  const subjects = allSubjects();
  const tags = allTags();

  return {
    subjects,
    tags
  };
}
