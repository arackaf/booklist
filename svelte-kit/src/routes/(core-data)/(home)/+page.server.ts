import { booksSubjectsDump } from "$data/books";
import { allSubjects } from "$data/subjects";

export async function load({ locals }: any) {
  const session = await locals.getSession();
  if (!session) {
    return {};
  }

  const subjects = allSubjects(session.userId);
  const books = booksSubjectsDump(session.userId);

  return {
    ...(await subjects),
    books
  };
}
