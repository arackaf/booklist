import { json } from "@sveltejs/kit";

import orderBy from "lodash/orderBy";

import { getPublicId } from "$lib/util/getPublicId.js";
import { db, executeDrizzle } from "$data/dbUtils.js";
import { books as booksTable, similarBooks } from "$data/drizzle-schema.js";
import { and, eq, inArray } from "drizzle-orm";

export async function POST({ locals, request }) {
  const publicUserId = getPublicId(request);

  const session = await locals.getSession();
  let userId: string;

  if (!session) {
    return json({ success: false });
  } else {
    ({ userId } = session);
  }

  const reqBody = await request.json();
  const { bookIds } = reqBody;

  const userIdToUse = userId || publicUserId;

  //...execute("SELECT id, similarBooks FROM books WHERE id IN (?)", [bookIds]);

  const books = await executeDrizzle(
    "load books for get-recommendations action",
    db
      .select({ id: booksTable.id, similarBooks: booksTable.similarBooks })
      .from(booksTable)
      .where(and(eq(booksTable.userId, userIdToUse), inArray(booksTable.id, bookIds)))
  );

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
    return json({
      success: true,
      results: []
    });
  }

  const resultRecommendations = await executeDrizzle(
    "load similar-books for get-recommendations action",
    db.select().from(similarBooks).where(inArray(similarBooks.isbn, isbns))
  );

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
    return json({
      success: true,
      results: []
    });
  }

  const matches = await executeDrizzle(
    "load books for final filtering for get-recommendations action",
    db
      .select()
      .from(booksTable)
      .where(and(eq(booksTable.userId, userIdToUse), inArray(booksTable.isbn, potentialIsbns)))
  );

  const matchingIsbns = new Set(matches.map(m => m.isbn).filter(x => x));
  const finalResults = potentialRecommendations.filter(m => !m.isbn || !matchingIsbns.has(m.isbn)).slice(0, 50);

  console.log(finalResults.length, "final results");
  return json({
    success: true,
    results: finalResults
  });
}
