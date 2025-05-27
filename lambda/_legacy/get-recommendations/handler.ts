import orderBy from "lodash.orderby";
import { getConnection } from "../../util/getDbConnection";

export const getRecommendations = async (evt: any) => {
  try {
    const connection = await getConnection();

    const { bookIds, userId, publicUserId } = evt;

    console.log("Getting recommendations for", bookIds);
    const allBooksReq = await connection.execute("SELECT id, similarBooks FROM books WHERE id IN (?)", [bookIds]);
    const books: any[] = allBooksReq.rows;

    const isbnMap = new Map<string, number>([]);
    books.forEach(book => {
      (book.similarBooks || []).forEach((isbn: string) => {
        if (!isbnMap.has(isbn)) {
          isbnMap.set(isbn, 0);
        }
        isbnMap.set(isbn, isbnMap.get(isbn)! + 1);
      });
    });

    const isbns = [...isbnMap.keys()];

    if (!isbns.length) {
      return {
        success: true,
        results: []
      };
    }

    const resultRecommendationsReq = await connection.execute("SELECT * FROM similar_books WHERE isbn IN (?)", [isbns]);
    const resultRecommendations: any[] = resultRecommendationsReq.rows;
    console.log("Found", resultRecommendations.length, "potential matches");

    const resultRecommendationLookup = new Map(resultRecommendations.map(b => [b.isbn, b]));
    const isbnsOrdered = orderBy(
      [...isbnMap.entries()].map(([isbn, count]) => ({ isbn, count })),
      ["count"],
      ["desc"]
    );
    const potentialRecommendations: any[] = isbnsOrdered.map((b: any) => resultRecommendationLookup.get(b.isbn)).filter((b: any) => b);
    const potentialIsbns = potentialRecommendations.map((b: any) => b.isbn).filter((x: any) => x);

    if (![potentialIsbns].length) {
      console.log("No results found");
      return {
        success: true,
        results: []
      };
    }

    const matchesReq = await connection.execute("SELECT * FROM books WHERE isbn IN (?) AND userId = ?", [potentialIsbns, userId || publicUserId]);
    const matches: any[] = matchesReq.rows;

    const matchingIsbns = new Set(matches.map(m => m.isbn).filter(x => x));
    const finalResults = potentialRecommendations.filter(m => !m.isbn || !matchingIsbns.has(m.isbn)).slice(0, 50);

    console.log(finalResults.length, "final results");
    return {
      success: true,
      results: finalResults
    };
  } catch (err) {
    try {
    } catch (er) {
      console.log({ er });
    }

    console.log("ERROR thrown", err);
    return { error: true };
  }
};
