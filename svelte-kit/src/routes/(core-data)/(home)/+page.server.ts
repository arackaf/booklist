import { aggregateBooksSubjects } from "$data/books";
import { ensureAnyUser } from "$lib/util/authCheck";
import { getPublicId } from "$lib/util/getPublicId";

export async function load({ locals, request }) {
  await ensureAnyUser({ locals, request });

  const session = await locals.getSession();
  const publicId = getPublicId(request);

  return {
    books: aggregateBooksSubjects(session?.userId || publicId)
  };
}
