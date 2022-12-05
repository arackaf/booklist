import { searchBooks } from "$data/books";
import { json } from "@sveltejs/kit";

export async function GET({ url }: { url: URL }) {
  const search = url.searchParams.get("search") || "";

  const books = await searchBooks(search);

  return json(books);
}
