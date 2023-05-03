import { getBooksWithSimilarBooks } from "$data/similar-books";
import { SYNC_BOOK_RECOMMENDATIONS_LAMBDA } from "$env/static/private";
import { invokeLambda } from "$lib/lambda-utils.js";

export const load = async () => {
  const books = await getBooksWithSimilarBooks();

  return { books };
};

export const actions = {
  async updateRecommended({ request }) {
    const formData: FormData = await request.formData();

    const id = parseInt(formData.get("id")?.toString()!, 10);
    console.log({ id });

    const result = await invokeLambda(SYNC_BOOK_RECOMMENDATIONS_LAMBDA, { id });

    console.log({ result });

    return { success: true };
  }
};
