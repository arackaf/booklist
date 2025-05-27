import { ObjectId, Db, MongoClient } from "mongodb";

import { lookupSimilarBooks } from "./goodreads/lookupSimilarBooks";
import { addPlaceholder, booksWithoutSimilarity, updateSimilarityInfo } from "./data-helpers/similar-books-helpers";

import getSecrets from "../../util/getSecrets";
import { delay } from "../../util/asyncHelpers";
import corsResponse from "../../util/corsResponse";
import { isWarmingCall } from "../../util/isWarmingCall";
import { getDbConnection } from "../util/getDbConnection";

import orderBy from "lodash.orderby";

export const updateSimilarBooks = async event => {
  let db: Db;
  let client: MongoClient;

  try {
    ({ db, client } = await getDbConnection());
    const secrets = await getSecrets();
    const grKey = secrets["goodreads-key"];

    const books = await booksWithoutSimilarity(db);
    await addPlaceholder(db, books);

    for (const book of books) {
      await updateSingleBook(db, book, grKey);
      await delay(1000);
    }
    await client.close();
  } catch (er) {
    await client?.close();
    console.log(er);
  }
};

export const updateSingleBook = async (db: Db, book, grKey) => {
  if (typeof book?.isbn !== "string") {
    console.log("Book not found", book);
    return;
  }

  console.log("Book Found", book);

  const isbn = book.isbn.replace("-", "");
  if (isbn.length !== 10 && isbn.length !== 13) {
    return;
  }

  const similarBooks = await lookupSimilarBooks(book.isbn, grKey);

  await updateSimilarityInfo(
    db,
    book,
    similarBooks.filter(b => b.isbn)
  );
};

export const getRecommendations = async evt => {
  if (isWarmingCall(evt)) {
    return corsResponse({ coldStartPrevented: true });
  }

  let db: Db;
  let client: MongoClient;
  try {
    const { bookIds, userId, publicUserId } = JSON.parse(evt.body);

    ({ db, client } = await getDbConnection());
    const books = await db
      .collection("books")
      .find({ _id: { $in: bookIds.map(_id => new ObjectId(_id)) } })
      .project({ _id: 1, similarItems: 1 })
      .toArray();

    const isbnMap = new Map<string, number>([]);
    books.forEach(book => {
      (book.similarItems || []).forEach(isbn => {
        if (!isbnMap.has(isbn)) {
          isbnMap.set(isbn, 0);
        }
        isbnMap.set(isbn, isbnMap.get(isbn) + 1);
      });
    });

    const isbns = [...isbnMap.keys()];

    const resultRecommendations = await db
      .collection("bookSummaries")
      .find({ isbn: { $in: isbns } })
      .toArray();

    const resultRecommendationLookup = new Map(resultRecommendations.map(b => [b.isbn, b]));
    const isbnsOrdered = orderBy(
      [...isbnMap.entries()].map(([isbn, count]) => ({ isbn, count })),
      ["count"],
      ["desc"]
    );
    const potentialRecommendations = isbnsOrdered.map(b => resultRecommendationLookup.get(b.isbn)).filter(b => b);
    const potentialIsbns = potentialRecommendations.map(b => b.isbn).filter(x => x);

    const matches = await db
      .collection("books")
      .find({ userId: userId || publicUserId, isbn: { $in: potentialIsbns } })
      .toArray();

    const matchingIsbns = new Set(matches.map(m => m.isbn).filter(x => x));
    const finalResults = potentialRecommendations.filter(m => !m.isbn || !matchingIsbns.has(m.isbn)).slice(0, 50);

    client.close();

    return corsResponse({
      success: true,
      results: finalResults
    });
  } catch (err) {
    try {
      client?.close();
    } catch (er) {}

    console.log("ERROR thrown", err);
    return corsResponse({ error: true });
  }
};
