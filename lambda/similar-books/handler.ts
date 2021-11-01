import getSecrets from "../util/getSecrets";
import { lookupSimilarBooks } from "./goodreads/lookupSimilarBooks";
import { addPlaceholder, booksWithoutSimilarity, updateSimilarityInfo } from "./data-helpers/similar-books-helpers";

import { delay } from "../util/asyncHelpers";
import corsResponse from "../util/corsResponse";

import { isWarmingCall } from "../util/isWarmingCall";
import checkLogin from "../util/checkLoginToken";

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

export const getRecommendations = async evt => {
  if (isWarmingCall(evt)) {
    return corsResponse({ coldStartPrevented: true });
  }

  const { bookIds, publicUserId, userId, loginToken } = JSON.parse(evt.body);

  console.log("CHECKING", userId, loginToken);
  if (!(await checkLogin(userId, loginToken))) {
    return corsResponse({ no: "NO" });
  }

  return corsResponse({ success: true });
};
