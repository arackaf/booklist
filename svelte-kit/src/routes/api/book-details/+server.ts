import { searchBooks } from "$data/books";
import type { BookSearch } from "$data/types";
import { json } from "@sveltejs/kit";

export async function GET({ url, setHeaders, locals }: { url: URL; cookies: any; setHeaders: any; locals: any }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  setHeaders({
    "cache-control": "max-age=3600"
  });

  const id = url.searchParams.get("id") || "";

  const bookDetails = {
    title: "Ayyyyy"
  };

  return json(bookDetails);
}
