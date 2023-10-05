import { getBookDetails } from "$data/books";
import { json } from "@sveltejs/kit";

export async function GET({ url, setHeaders, locals }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  const id = url.searchParams.get("id") || "";
  const bookDetails = await getBookDetails(id);

  if (bookDetails.similarBooks?.length) {
    setHeaders({
      "cache-control": "max-age=3600"
    });
  }

  return json(bookDetails);
}
