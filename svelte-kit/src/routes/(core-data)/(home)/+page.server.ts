import { booksSubjectsDump } from "$data/books";
import { redirectToLanding } from "$lib/util/authCheck";

export async function load({ locals }: any) {
  const session = await locals.getSession();
  if (!session) {
    redirectToLanding();
  }

  return {
    books: booksSubjectsDump(session.userId)
  };
}
