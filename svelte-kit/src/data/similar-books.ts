//import type {  } from "./types";
import { executeQuery } from "./dbUtils";

export const getBooksWithSimilarBooks = async (): Promise<any> => {
  const editorialReviewsQuery = await executeQuery<any>(
    "books with similar books",
    `
  SELECT * FROM books LIMIT 1;
  SELECT * FROM books LIMIT 1;
  `
  );

  return editorialReviewsQuery;
};
