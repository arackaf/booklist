import { json } from "@sveltejs/kit";

import type { BookSearch, BookSortValue } from "$data/types";
import { searchBooks } from "$data/books";
import { DEFAULT_BOOKS_PAGE_SIZE } from "$data/constants";

export async function GET({ url }) {
  const userId = "573d1b97120426ef0078aa92";

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

  const packet: BookSearch = {
    publicUser,
    page,
    pageSize: DEFAULT_BOOKS_PAGE_SIZE,
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
