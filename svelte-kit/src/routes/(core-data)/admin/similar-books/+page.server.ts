import { getBooksWithSimilarBooks } from "$data/similar-books";

export const load = async () => {
  const books = await getBooksWithSimilarBooks();

  return { books };
};

export const actions = {
  async updateRecommended({ request }) {
    const formData: FormData = await request.formData();

    const id = parseInt(formData.get("id")?.toString()!, 10);
    console.log({ id });

    return { success: true };
  }
};
