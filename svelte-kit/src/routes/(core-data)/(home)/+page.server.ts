import { booksSubjectsDump } from "$data/books";
import { ensureAnyUser } from "$lib/util/authCheck";

export async function load({ locals, request }: any) {
  await ensureAnyUser({ locals, request });

  const session = await locals.getSession();

  return {
    books: booksSubjectsDump(session.userId)
  };
}
