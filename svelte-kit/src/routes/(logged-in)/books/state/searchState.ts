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

const DEFAULT_SORT = "_id-desc";

export const searchState = derived(page, $page => {
  const searchParams = $page.url.searchParams;
  const subjects = searchParams.getAll("subjects") ?? [];
  const tags = searchParams.getAll("tags") ?? [];
  const childSubjects = searchParams.get("child-subjects");
  const noSubjects = searchParams.get("no-subjects") === "true";

  const sort = searchParams.get("sort");
  const sortString = sort ?? DEFAULT_SORT;
  const [sortField, sortDirection] = sortString.split("-");

  const subjectHash = $page.data.subjectHash;
  const subjectsObjects = subjects.map(_id => subjectHash[_id]).filter(s => s);

  const tagHash = $page.data.tagHash;
  const tagObjects = tags.map(_id => tagHash[_id]).filter(s => s);

  const result = {
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
    ...arrayFilters.flatMap(key => result[key]),
    ...toggleFilters.filter(key => result[key])
  ].length;

  return result;
});

export const changeFilter = derived(page, $page => {
  const { url } = $page;
  const userId = url.searchParams.get("userId");

  return {
    withoutSearch: urlWithoutFilter(url, "search"),
    withoutAuthor: urlWithoutFilter(url, "author"),
    withoutIsRead: urlWithoutFilter(url, "is-read"),
    withoutPublisher: urlWithoutFilter(url, "publisher"),
    withoutNoSubjects: urlWithoutFilter(url, "no-subjects"),
    withoutSort: urlWithoutFilter(url, "sort"),
    withoutFilters: `/books${userId ? `?userId=${userId}` : ""}`,

    withSort(field: string) {
      const [sortField, sortDirection] = (url.searchParams.get("sort") ?? DEFAULT_SORT).split("-");

      let direction = "asc";
      if (field === sortField && sortDirection === "asc") {
        direction = "desc";
      }
      return urlWithFilter(url, "sort", `${field}-${direction}`);
    },

    addSubject(_id: string) {
      const subjects = url.searchParams.getAll("subjects");
      if (subjects.includes(_id)) {
        return null;
      }

      return urlWithArrayFilter(url, "subjects", subjects.concat(_id));
    },
    withoutSubject(_id: string) {
      const subjects = url.searchParams.getAll("subjects");
      const newSubjects = subjects.filter(s => s !== _id);

      return urlWithArrayFilter(url, "subjects", newSubjects);
    },

    addTag(_id: string) {
      const tags = url.searchParams.getAll("tags");
      if (tags.includes(_id)) {
        return null;
      }

      return urlWithArrayFilter(url, "tags", tags.concat(_id));
    },
    withoutTag(_id: string) {
      const tags = url.searchParams.getAll("tags");
      const newTags = tags.filter(s => s !== _id);

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
