import { ObjectId, Db, MongoClient } from "mongodb";
import orderBy from "lodash.orderby";

import { getDbConnection } from "../util/getDbConnection";

export const getRecommendations = async evt => {
  let db: Db;
  let client: MongoClient;
  try {
    const { bookIds, userId, publicUserId } = evt;

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

    return {
      success: true,
      results: finalResults
    };
  } catch (err) {
    try {
      client?.close();
    } catch (er) {}

    console.log("ERROR thrown", err);
    return { error: true };
  }
};
