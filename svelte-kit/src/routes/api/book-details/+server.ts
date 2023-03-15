import { getBookDetails } from "$data/books";
import { json } from "@sveltejs/kit";

export async function GET({ url, setHeaders, locals }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  setHeaders({
    "cache-control": "max-age=3600"
  });

  const id = url.searchParams.get("id") || "";

  console.log({ id });
  const bookDetails = await getBookDetails(id);

  return json(bookDetails);
}
