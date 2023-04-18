import { getBooksWithSimilarBooks } from "$data/similar-books";

export const load = async () => {
  const books = await getBooksWithSimilarBooks();

  return { books };
};
