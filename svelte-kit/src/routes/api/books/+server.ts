import { searchBooks } from "$data/books";
import type { BookSearch } from "$data/types";
import { BOOKS_CACHE } from "$lib/state/cacheHelpers";
import { json } from "@sveltejs/kit";

export async function GET({ url, setHeaders, locals }: { url: URL; cookies: any; request: any; setHeaders: any; locals: any }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  setHeaders({
    "cache-control": "max-age=60"
  });

  const search = url.searchParams.get("search") || "";
  const publisher = url.searchParams.get("publisher") || "";
  const author = url.searchParams.get("author") || "";
  const sortString = url.searchParams.get("sort") || "";
  const tags = url.searchParams.getAll("tags");
  const subjects = url.searchParams.getAll("subjects");
  const searchChildSubjects = url.searchParams.get("child-subjects") ? true : undefined;

  const packet: BookSearch = {
    author,
    search,
    publisher,
    tags,
    subjects,
    searchChildSubjects
  };

  if (sortString) {
    const [field, dir] = sortString.split("-");
    packet.sort = {
      [field]: dir === "desc" ? -1 : 1
    };
  }

  const books = await searchBooks(session.userId, packet);

  return json(books);
}
