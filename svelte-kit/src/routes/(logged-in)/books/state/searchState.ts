import { page } from "$app/stores";
import { derived } from "svelte/store";

type SortValue = keyof typeof sortDisplayLookup;
export const sortDisplayLookup = {
  "title-asc": "Title A-Z",
  "title-desc": "Title Z-A",
  "pages-asc": "Pages, Low",
  "pages-desc": "Pages, High",
  "_id-asc": "Added, Earliest",
  "_id-desc": "Added, Most Recent"
};

export const getSortDisplay = (sortVal: SortValue) => sortDisplayLookup[sortVal];

export const searchState = derived(page, $page => {
  const searchParams = $page.url.searchParams;
  const subjects = searchParams.getAll("subjects") ?? [];
  const tags = searchParams.getAll("tags") ?? [];
  const childSubjects = searchParams.get("child-subjects");
  const noSubjects = searchParams.get("no-subjects") === "true";

  const sort = searchParams.get("sort");
  const sortString = sort ?? "_id-desc";
  const [sortField, sortDirection] = sortString.split("-");

  return {
    search: searchParams.get("search") ?? "",
    author: searchParams.get("author") ?? "",
    publisher: searchParams.get("publisher") ?? "",
    isRead: searchParams.get("is-read") ?? "",
    subjects,
    subjectsLookup: new Set(subjects),
    childSubjects,
    noSubjects,
    tags,
    tagsLookup: new Set(tags),
    selectedSubjects: [],
    selectedTags: [],
    sort,
    sortPacket: `${sortField}-${sortDirection}` as SortValue,
    sortField,
    sortDirection
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
    withoutIsRead: urlWithoutFilter($page.url, "is-read"),
    withoutPublisher: urlWithoutFilter($page.url, "publisher"),
    withoutNoSubjects: urlWithoutFilter($page.url, "no-subjects"),
    withoutSort: urlWithoutFilter($page.url, "sort"),

    withSort(value: string) {
      urlWithFilter($page.url, "sort", value);
    }
  };
});

const urlWithoutFilter = (url: URL, filter: string) => {
  const newUrl = new URL(url);
  newUrl.searchParams.delete(filter);
  return newUrl.toString();
};

const urlWithFilter = (url: URL, filter: string, value: string) => {
  const newUrl = new URL(url);
  newUrl.searchParams.set(filter, value);
  return newUrl.toString();
};
