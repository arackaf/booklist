import { json } from "@sveltejs/kit";

import { searchBooks } from "$data/books";
import type { BookSearch } from "$data/types";

export async function GET({ url, setHeaders, locals }: { url: URL; cookies: any; request: any; setHeaders: any; locals: any }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  setHeaders({
    "cache-control": "max-age=60"
  });

  const publicUser = url.searchParams.get("userId") || "";
  const page = parseInt(url.searchParams.get("page")!) || 1;
  const search = url.searchParams.get("search") || "";
  const publisher = url.searchParams.get("publisher") || "";
  const author = url.searchParams.get("author") || "";
  const isRead = url.searchParams.get("is-read") || "";
  const sortString = url.searchParams.get("sort") || "";
  const tags = url.searchParams.getAll("tags");
  const subjects = url.searchParams.getAll("subjects");
  const searchChildSubjects = url.searchParams.get("child-subjects") ? true : undefined;
  const noSubjects = url.searchParams.get("no-subjects") === "true";

  console.log({ search, tags, subjects, searchChildSubjects, isRead });

  const packet: BookSearch = {
    publicUser,
    page,
    author,
    search,
    publisher,
    isRead: isRead === "" ? void 0 : isRead === "true",
    tags,
    subjects,
    searchChildSubjects,
    noSubjects
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
