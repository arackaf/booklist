import getSecrets from "../util/getSecrets";
import { lookupBook } from "./goodreads/lookupBook";
import { addSimilarBookInfoPlaceholder, booksWithoutSimilarity } from "./data-helpers/bookHelpers";

export const lookupSimilarBooks = async event => {
  try {
    const secrets = await getSecrets();
    const grKey = secrets["goodreads-key"];

    const book = await booksWithoutSimilarity();
    await addSimilarBookInfoPlaceholder(book);

    console.log("Book Found", book);

    if (typeof book?.isbn !== "string") {
      return;
    }
    let isbn = book.isbn.replace("-", "");
    if (isbn.length !== 10 && isbn.length !== 13) {
      return;
    }

    const similarBooks = await lookupBook(book.isbn, grKey);

    console.log("YO", book, similarBooks);
  } catch (er) {
    console.log(er);
  }
};
