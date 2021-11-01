import { ObjectId } from "mongodb";

import { lookupSimilarBooks } from "./goodreads/lookupSimilarBooks";
import { addPlaceholder, booksWithoutSimilarity, updateSimilarityInfo } from "./data-helpers/similar-books-helpers";

import getSecrets from "../util/getSecrets";
import { delay } from "../util/asyncHelpers";
import corsResponse from "../util/corsResponse";
import { isWarmingCall } from "../util/isWarmingCall";
import getDbConnection from "../util/getDbConnection";

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

  const { bookIds } = JSON.parse(evt.body);

  const db = await getDbConnection();
  const books = await db
    .collection("books")
    .find({ _id: { $in: bookIds.map(_id => ObjectId(_id)) } }, { _id: 1, similarItems: 1 })
    .toArray();

  let isbnMap = new Map<string, number>([]);
  books.forEach(book => {
    (book.similarItems || []).forEach(isbn => {
      if (!isbnMap.has(isbn)) {
        isbnMap.set(isbn, 0);
      }
      isbnMap.set(isbn, isbnMap.get(isbn) + 1);
    });
  });

  return corsResponse({ success: true, len: books.length, len2: isbnMap.size });
};
