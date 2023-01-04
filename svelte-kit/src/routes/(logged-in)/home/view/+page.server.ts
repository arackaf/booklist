import { booksSubjectsDump } from "$data/books";
import { allSubjects } from "$data/subjects";

export async function load() {
  const subjects = allSubjects();
  const books = booksSubjectsDump();

  return {
    subjects,
    books
  };
}
