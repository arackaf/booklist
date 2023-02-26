import { booksSubjectsDump, aggregateBooksSubjects } from "$data/books";
import { ensureAnyUser } from "$lib/util/authCheck";
import { getPublicId } from "$lib/util/getPublicId";

export async function load({ locals, request }: any) {
  await ensureAnyUser({ locals, request });

  const session = await locals.getSession();
  const publicId = getPublicId(request);

  const A = await booksSubjectsDump(session?.userId || publicId);
  const B = await aggregateBooksSubjects(session?.userId || publicId);

  return {
    books: booksSubjectsDump(session?.userId || publicId)
  };
}
