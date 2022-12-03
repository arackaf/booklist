import { page } from "$app/stores";
import { derived, get } from "svelte/store";

export const searchState = derived(page, $page => {
  const searchParams = $page.url.searchParams;
  const subjects = searchParams.getAll("subjects") ?? [];

  const sort = searchParams.get("sort") ?? "_id";
  const sortDirection = searchParams.get("sortDirection") ?? "desc";

  return {
    search: searchParams.get("search") ?? "",
    author: searchParams.get("author") ?? "",
    publisher: searchParams.get("publisher") ?? "",
    subjects,
    subjectsLookup: new Set(subjects),
    selectedSubjects: [],
    selectedTags: [],
    sortPacket: `${sort}|${sortDirection}`
  };
});

export const urlWithoutFilter = (filter: string) => {
  const newUrl = new URL(get(page).url);
  newUrl.searchParams.delete(filter);
  return newUrl.toString();
};
