import getSecrets from "../util/getSecrets";
import { lookupBook } from "./goodreads/lookupBook";
import { addPlaceholder, booksWithoutSimilarity, updateSimilarityInfo } from "./data-helpers/similar-books-helpers";

export const lookupSimilarBooks = async event => {
  try {
    const secrets = await getSecrets();
    const grKey = secrets["goodreads-key"];

    const book = (await booksWithoutSimilarity())[0];
    if (typeof book?.isbn !== "string") {
      console.log("Book not found", book);
      return;
    }

    await addPlaceholder(book);

    console.log("Book Found", book);

    let isbn = book.isbn.replace("-", "");
    if (isbn.length !== 10 && isbn.length !== 13) {
      return;
    }

    const similarBooks = await lookupBook(book.isbn, grKey);

    await updateSimilarityInfo(
      book,
      similarBooks.filter(b => b.isbn)
    );
  } catch (er) {
    console.log(er);
  }
};
