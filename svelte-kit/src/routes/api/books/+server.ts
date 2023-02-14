import { json } from "@sveltejs/kit";

import type { BookSearch } from "$data/types";
import { searchBooks } from "$data/books";
import { DEFAULT_BOOKS_PAGE_SIZE } from "$lib/state/dataConstants";

export async function GET({ url, setHeaders, locals }: { url: URL; cookies: any; request: any; setHeaders: any; locals: any }) {
  const session = await locals.getSession();
  let userId = session?.userId;

  setHeaders({
    "cache-control": "max-age=60"
  });

  const isMobile = (url.searchParams.get("is-mobile") || "") === "true";
  const publicUser = url.searchParams.get("user") || "";
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
  const resultSet = url.searchParams.get("result-set") || "";

  if (publicUser) {
    userId = publicUser;
  }

  const packet: BookSearch = {
    publicUser,
    page,
    pageSize: isMobile ? Math.round(DEFAULT_BOOKS_PAGE_SIZE / 2) : DEFAULT_BOOKS_PAGE_SIZE,
    author,
    search,
    publisher,
    isRead: isRead === "" ? void 0 : isRead === "true",
    tags,
    subjects,
    searchChildSubjects,
    noSubjects,
    resultSet
  };

  if (sortString) {
    const [field, dir] = sortString.split("-");
    packet.sort = {
      [field]: dir === "desc" ? -1 : 1
    };
  }

  const books = await searchBooks(userId, packet);

  return json(books);
}
