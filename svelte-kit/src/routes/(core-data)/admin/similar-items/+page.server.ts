import { getBooksWithSimilarBooks } from "$data/similar-books";

export const load = async () => {
  const data = await getBooksWithSimilarBooks();

  console.log(data);

  return {};
};
