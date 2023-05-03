import { getBooksWithSimilarBooks } from "$data/similar-books";
import { ADMIN_USER, SYNC_BOOK_RECOMMENDATIONS_LAMBDA } from "$env/static/private";
import { invokeLambda } from "$lib/lambda-utils.js";
import { redirect } from "@sveltejs/kit";

export const config = {
  runtime: "nodejs18.x"
};

export const load = async ({ parent }) => {
  const parentParams = await parent();
  if (!parentParams.isAdminUser) {
    throw redirect(302, "/");
  }
  const books = await getBooksWithSimilarBooks();

  return { books };
};

export const actions = {
  async updateRecommended({ request, locals }) {
    const session = await locals.getSession();
    if (session?.userId !== ADMIN_USER) {
      return {};
    }

    const formData: FormData = await request.formData();

    const id = parseInt(formData.get("id")?.toString()!, 10);
    console.log({ id });

    const result = await invokeLambda(SYNC_BOOK_RECOMMENDATIONS_LAMBDA, { id });

    console.log({ result });

    return { success: true };
  }
};
