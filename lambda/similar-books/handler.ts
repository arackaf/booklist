import { ObjectId } from "mongodb";

import { lookupSimilarBooks } from "./goodreads/lookupSimilarBooks";
import { addPlaceholder, booksWithoutSimilarity, updateSimilarityInfo } from "./data-helpers/similar-books-helpers";

import getSecrets from "../util/getSecrets";
import { delay } from "../util/asyncHelpers";
import corsResponse from "../util/corsResponse";
import { isWarmingCall } from "../util/isWarmingCall";
import getDbConnection from "../util/getDbConnection";

import orderBy from "lodash.orderby";

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

  const { bookIds, userId, publicUserId } = JSON.parse(evt.body);

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

  let isbns = [...isbnMap.keys()];

  let resultRecommendations = await db
    .collection("bookSummaries")
    .find({ isbn: { $in: isbns } })
    .toArray();

  let resultRecommendationLookup = new Map(resultRecommendations.map(b => [b.isbn, b]));
  let isbnsOrdered = orderBy(
    [...isbnMap.entries()].map(([isbn, count]) => ({ isbn, count })),
    ["count"],
    ["desc"]
  );
  let potentialRecommendations = isbnsOrdered.map(b => resultRecommendationLookup.get(b.isbn)).filter(b => b);

  let potentialIsbns = potentialRecommendations.map(b => b.isbn).filter(x => x);

  const matches = await db
    .collection("books")
    .find({ userId: userId || publicUserId, isbn: { $in: potentialIsbns } })
    .toArray();

  let matchingIsbns = new Set(matches.map(m => m.isbn).filter(x => x));

  let finalResults = potentialRecommendations.filter(m => !m.isbn || !matchingIsbns.has(m.isbn)).slice(0, 50);

  return corsResponse({
    success: true,
    results: finalResults,
    titles: finalResults.map(b => b.title)
  });
};
