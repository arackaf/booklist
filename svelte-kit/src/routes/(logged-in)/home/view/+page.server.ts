import { booksSubjectsDump } from "$data/books";
import { allSubjects } from "$data/subjects";
import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";

export async function load() {
  const subjects = allSubjects();
  const books = booksSubjectsDump();

  return {
    subjects,
    books
  };
}
