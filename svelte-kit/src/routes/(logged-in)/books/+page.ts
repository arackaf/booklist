import { writable } from "svelte/store";

export async function load(params: any) {
  const search = params.url.searchParams.get("search") || "";

  const resp = await params.fetch("/api/books?search=" + search);
  const books = await resp.json();

  params.depends("books-results");

  return {
    books: writable(books)
  };
}
