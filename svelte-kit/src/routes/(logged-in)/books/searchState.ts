import { page } from "$app/stores";
import { derived, get } from "svelte/store";

export const searchState = derived(page, $page => {
  const searchParams = $page.url.searchParams;
  const subjects = searchParams.getAll("subjects") ?? [];
  const tags = searchParams.getAll("tags") ?? [];

  const sortString = searchParams.get("sort") ?? "_id-desc";
  const [sortField, sortDir] = sortString.split("-");

  return {
    search: searchParams.get("search") ?? "",
    author: searchParams.get("author") ?? "",
    publisher: searchParams.get("publisher") ?? "",
    subjects,
    subjectsLookup: new Set(subjects),
    tags,
    tagsLookup: new Set(tags),
    selectedSubjects: [],
    selectedTags: [],
    sortPacket: `${sortField}-${sortDir}`
  };
});

export const searchMutationState = derived([page, searchState], ([$page, $searchState]) => {
  return {
    urlWithSubjectFilter(_id: string) {
      if ($searchState.subjectsLookup.has(_id)) {
        return null;
      } else {
        const searchParams = new URLSearchParams($page.url.searchParams);
        searchParams.append("subjects", _id);
        return `/books?${searchParams.toString()}`;
      }
    },
    urlWithTagFilter(_id: string) {
      if ($searchState.tagsLookup.has(_id)) {
        return null;
      } else {
        const searchParams = new URLSearchParams($page.url.searchParams);
        searchParams.append("tags", _id);
        return `/books?${searchParams.toString()}`;
      }
    }
  };
});

export const changeFilter = derived(page, $page => {
  return {
    withoutSearch: urlWithoutFilter($page.url, "search"),
    withoutAuthor: urlWithoutFilter($page.url, "author"),
    withoutPublisher: urlWithoutFilter($page.url, "publisher")
  };
});

const urlWithoutFilter = (url: URL, filter: string) => {
  const newUrl = new URL(url);
  newUrl.searchParams.delete(filter);
  return newUrl.toString();
};
