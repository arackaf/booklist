import { json } from "@sveltejs/kit";

import type { BookSearch, BookSortKeys, BookSortValue } from "$data/types";
import { searchBooks } from "$data/books";
import { DEFAULT_BOOKS_PAGE_SIZE, EMPTY_BOOKS_RESULTS } from "$data/constants";
import { getUserIdFromToken } from "$lib/util/fireBaseAuth.js";

export const config = {
  runtime: "nodejs18.x"
};

export async function POST({ request, url, setHeaders }) {
  setHeaders({
    "cache-control": "max-age=60"
  });

  const body = await request.json();
  const token = body.token;

  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return json(EMPTY_BOOKS_RESULTS);
  }

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
  const resultSet = "ios";

  const packet: BookSearch = {
    page,
    pageSize: Math.round(DEFAULT_BOOKS_PAGE_SIZE / 2),
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
    } as BookSortValue;
  }

  const booksPacket = await searchBooks(userId!, packet);

  return json(booksPacket);
}
