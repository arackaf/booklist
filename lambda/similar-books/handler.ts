import getSecrets from "../util/getSecrets";
import { lookupSimilarBooks } from "./goodreads/lookupSimilarBooks";
import { addPlaceholder, booksWithoutSimilarity, updateSimilarityInfo } from "./data-helpers/similar-books-helpers";

import { delay } from "../util/asyncHelpers";

export const updateSimilarBooks = async event => {
  try {
    const secrets = await getSecrets();
    const grKey = secrets["goodreads-key"];

    const books = await booksWithoutSimilarity();
    await addPlaceholder(books);

    for (const book of books) {
      await updateSingleBook(book, grKey);
      await delay(1000);
    }
  } catch (er) {
    console.log(er);
  }
};

export const updateSingleBook = async (book, grKey) => {
  if (typeof book?.isbn !== "string") {
    console.log("Book not found", book);
    return;
  }

  console.log("Book Found", book);

  let isbn = book.isbn.replace("-", "");
  if (isbn.length !== 10 && isbn.length !== 13) {
    return;
  }

  const similarBooks = await lookupSimilarBooks(book.isbn, grKey);

  await updateSimilarityInfo(
    book,
    similarBooks.filter(b => b.isbn)
  );
};
