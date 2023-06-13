import { derived } from "svelte/store";
import { page } from "$app/stores";
import { toHash } from "$lib/state/helpers";

type SortValue = keyof typeof sortDisplayLookup;
export const sortDisplayLookup = {
  "title-asc": "Title A-Z",
  "title-desc": "Title Z-A",
  "pages-asc": "Pages, Low",
  "pages-desc": "Pages, High",
  "id-asc": "Added, Earliest",
  "id-desc": "Added, Most Recent"
};

export const getSortDisplay = (sortVal: SortValue) => sortDisplayLookup[sortVal];

const DEFAULT_SORT = "id-desc";

export const publicUser = derived(page, $page => {
  const searchParams = $page.url.searchParams;
  return searchParams.get("user") || "";
});

export const searchState = derived(page, $page => {
  const searchParams = $page.url.searchParams;

  const subjects = searchParams.getAll("subjects") ?? [];
  const tags = searchParams.getAll("tags") ?? [];
  const childSubjects = searchParams.get("child-subjects");
  const noSubjects = searchParams.get("no-subjects") === "true";

  const sort = searchParams.get("sort");
  const sortString = sort ?? DEFAULT_SORT;
  const [sortField, sortDirection] = sortString.split("-");

  const subjectHash = toHash<{ id: number; name: string }>($page.data.subjects);
  const subjectsObjects = subjects.map(id => subjectHash[id]).filter(s => s);

  const tagHash = toHash<{ id: number; name: string }>($page.data.tags);
  const tagObjects = tags.map(id => tagHash[id]).filter(s => s);

  const result = {
    page: parseInt(searchParams.get("page")!) || 1,
    search: searchParams.get("search") ?? "",
    author: searchParams.get("author") ?? "",
    publisher: searchParams.get("publisher") ?? "",
    isRead: searchParams.get("is-read") ?? "",
    subjects,
    subjectsObjects,
    childSubjects,
    noSubjects,
    tags,
    tagObjects,
    sort,
    sortPacket: `${sortField}-${sortDirection}` as SortValue,
    sortField,
    sortDirection,
    activeFilterCount: 0
  };

  type ResultKey = keyof typeof result;

  const simpleFilters: ResultKey[] = ["search", "author", "publisher", "isRead"];
  const arrayFilters: ResultKey[] = ["subjects", "tags"];
  const toggleFilters: ResultKey[] = ["noSubjects", "childSubjects"];

  result.activeFilterCount = [
    ...simpleFilters.filter(key => result[key]),
    ...arrayFilters.flatMap(key => result[key] as any),
    ...toggleFilters.filter(key => result[key])
  ].length;

  return result;
});

export const changeFilter = derived(page, $page => {
  const { url } = $page;
  const userId = url.searchParams.get("userId");
  const page = parseInt(url.searchParams.get("page")!) || 1;

  function pageTo(val: number, totalPages?: number) {
    if (val === 1 && page === 1) {
      return null;
    }
    if (val === 1) {
      return urlWithoutFilter(url, "page");
    }

    if (val === page || val < 1 || val > totalPages!) {
      return null;
    }

    return urlWithFilter(url, "page", String(val));
  }

  return {
    withoutSearch: urlWithoutFilter(url, "search"),
    withoutAuthor: urlWithoutFilter(url, "author"),
    withoutIsRead: urlWithoutFilter(url, "is-read"),
    withoutPublisher: urlWithoutFilter(url, "publisher"),
    withoutNoSubjects: urlWithoutFilter(url, "no-subjects"),
    withoutChildSubjects: urlWithoutFilter(url, "child-subjects"),
    withoutSort: urlWithoutFilter(url, "sort"),
    withoutFilters: `/books${userId ? `?userId=${userId}` : ""}`,
    pageTo: (val: number, totalPages?: number) => pageTo(val, totalPages),

    withSort(field: string) {
      const [sortField, sortDirection] = (url.searchParams.get("sort") ?? DEFAULT_SORT).split("-");

      let direction = "asc";
      if (field === sortField && sortDirection === "asc") {
        direction = "desc";
      }
      return urlWithFilter(url, "sort", `${field}-${direction}`);
    },

    addSubject(id: number) {
      const subjects = url.searchParams.getAll("subjects");
      if (subjects.includes(id + "")) {
        return null;
      }

      return urlWithArrayFilter(url, "subjects", subjects.concat(id + ""));
    },
    withoutSubject(id: number) {
      const subjects = url.searchParams.getAll("subjects");
      const newSubjects = subjects.filter(s => s !== id + "");

      return urlWithArrayFilter(url, "subjects", newSubjects);
    },

    addTag(id: number) {
      const tags = url.searchParams.getAll("tags");
      if (tags.includes(id + "")) {
        return null;
      }

      return urlWithArrayFilter(url, "tags", tags.concat(id + ""));
    },
    withoutTag(id: number) {
      const tags = url.searchParams.getAll("tags");
      const newTags = tags.filter(s => s !== id + "");

      return urlWithArrayFilter(url, "tags", newTags);
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

const urlWithArrayFilter = (url: URL, filter: string, values: string[]) => {
  const newUrl = new URL(url);

  newUrl.searchParams.delete(filter);
  for (const s of values) {
    newUrl.searchParams.append(filter, s);
  }

  return newUrl.toString();
};
