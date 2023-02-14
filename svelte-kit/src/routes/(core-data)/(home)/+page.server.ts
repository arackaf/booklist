import { booksSubjectsDump } from "$data/books";
import { ensureAnyUser } from "$lib/util/authCheck";
import { getPublicId } from "$lib/util/getPublicId";

export async function load({ locals, request }: any) {
  await ensureAnyUser({ locals, request });

  const session = await locals.getSession();
  const parentId = getPublicId(request);

  return {
    books: booksSubjectsDump(session?.userId || parentId)
  };
}
