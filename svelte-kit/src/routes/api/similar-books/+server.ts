import { json } from "@sveltejs/kit";
import { getSimilarBooksForBook } from "$data/similar-books.js";

export async function GET({ url, setHeaders, locals }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  const id = parseInt(url.searchParams.get("id") || "", 10) || 0;
  const results = await getSimilarBooksForBook(id);

  setHeaders({
    "cache-control": "max-age=3600"
  });

  return json(results);
}
