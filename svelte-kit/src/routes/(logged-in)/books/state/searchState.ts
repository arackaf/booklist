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

  const subjectsHash = $page.data.subjectsHash;
  const subjectsObjects = subjects.map(_id => subjectsHash[_id]).filter(s => s);

  const tagHash = $page.data.tags.tagHash;
  const tagObjects = tags.map(_id => tagHash[_id]).filter(s => s);

  return {
    search: searchParams.get("search") ?? "",
    author: searchParams.get("author") ?? "",
    publisher: searchParams.get("publisher") ?? "",
    isRead: searchParams.get("is-read") ?? "",
    subjects,
    subjectsLookup: new Set(subjects),
    subjectsObjects,
    childSubjects,
    noSubjects,
    tags,
    tagsLookup: new Set(tags),
    tagObjects,
    selectedSubjects: [],
    selectedTags: [],
    sort,
    sortPacket: `${sortField}-${sortDirection}` as SortValue,
    sortField,
    sortDirection
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

    withSort(field: string) {
      const [sortField, sortDirection] = ($page.url.searchParams.get("sort") ?? DEFAULT_SORT).split("-");

      let direction = "asc";
      if (field === sortField && sortDirection === "asc") {
        direction = "desc";
      }
      return urlWithFilter($page.url, "sort", `${field}-${direction}`);
    },

    addSubject(_id: string) {
      const subjects = $page.url.searchParams.getAll("subjects");
      if (subjects.includes(_id)) {
        return null;
      }

      return urlWithArrayFilter($page.url, "subjects", subjects.concat(_id));
    },
    withoutSubject(_id: string) {
      const subjects = $page.url.searchParams.getAll("subjects");
      const newSubjects = subjects.filter(s => s !== _id);

      return urlWithArrayFilter($page.url, "subjects", newSubjects);
    },

    addTag(_id: string) {
      const tags = $page.url.searchParams.getAll("tags");
      if (tags.includes(_id)) {
        return null;
      }

      return urlWithArrayFilter($page.url, "tags", tags.concat(_id));
    },
    withoutTag(_id: string) {
      const tags = $page.url.searchParams.getAll("tags");
      const newTags = tags.filter(s => s !== _id);

      return urlWithArrayFilter($page.url, "tags", newTags);
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
