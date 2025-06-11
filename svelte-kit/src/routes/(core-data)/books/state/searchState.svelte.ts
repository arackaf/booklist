import { page } from "$app/state";
import type { BookSortKeys } from "$data/types";
import { toHash } from "$lib/state/helpers";

export const sortDisplayLookup: Record<`${BookSortKeys}-${"asc" | "desc"}`, string> = {
  "title-asc": "Title A-Z",
  "title-desc": "Title Z-A",
  "rating-desc": "Rating, Highest",
  "rating-asc": "Rating, Lowest",
  "added-desc": "Added, Most Recent",
  "added-asc": "Added, Earliest",
  "pages-desc": "Pages, High",
  "pages-asc": "Pages, Low"
};
export type SortValue = keyof typeof sortDisplayLookup;

export const getSortDisplay = (sortVal: SortValue) => sortDisplayLookup[sortVal];

const DEFAULT_SORT: SortValue = "added-desc";

export const publicUser = new (class {
  value = $derived.by(() => {
    const searchParams = page.url.searchParams;
    return searchParams.get("user") || "";
  });
})();

export class SearchState {
  value = $derived.by(() => {
    const searchParams = page.url.searchParams;

    const subjects = searchParams.getAll("subjects") ?? [];
    const tags = searchParams.getAll("tags") ?? [];
    const childSubjects = searchParams.get("child-subjects");
    const noSubjects = searchParams.get("no-subjects") === "true";

    const sort = searchParams.get("sort") as SortValue | undefined;
    const sortString = sort ?? DEFAULT_SORT;
    const [sortField, sortDirection] = sortString.split("-") as [BookSortKeys, "asc" | "desc"];

    const subjectHash = toHash<{ id: number; name: string }>(page.data.subjects);
    const subjectsObjects = subjects.map(id => subjectHash[id]).filter(s => s);

    const tagHash = toHash<{ id: number; name: string }>(page.data.tags);
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
}

export class ChangeFilters {
  url = $derived(page.url);
  userId = $derived(this.url.searchParams.get("userId"));
  pageNumber = $derived(parseInt(this.url.searchParams.get("page")!) || 1);

  getPageToUrl(val: number, totalPages?: number) {
    if (val === 1 && this.pageNumber === 1) {
      return null;
    }
    if (val === 1) {
      return urlWithoutFilter(this.url, "page");
    }

    if (val === this.pageNumber || val < 1 || val > totalPages!) {
      return null;
    }

    return urlWithFilter(this.url, "page", String(val));
  }

  withoutSearch = $derived(urlWithoutFilter(this.url, "search"));
  withoutAuthor = $derived(urlWithoutFilter(this.url, "author"));
  withoutIsRead = $derived(urlWithoutFilter(this.url, "is-read"));
  withoutPublisher = $derived(urlWithoutFilter(this.url, "publisher"));
  withoutNoSubjects = $derived(urlWithoutFilter(this.url, "no-subjects"));
  withoutChildSubjects = $derived(urlWithoutFilter(this.url, "child-subjects"));
  withoutSort = $derived(urlWithoutFilter(this.url, "sort"));
  withoutFilters = $derived(`/books${this.userId ? `?userId=${this.userId}` : ""}`);
  pageTo = (val: number, totalPages?: number) => this.getPageToUrl(val, totalPages);

  withSort(field: BookSortKeys) {
    const [sortField, sortDirection] = (this.url.searchParams.get("sort") ?? DEFAULT_SORT).split("-");

    let direction: "asc" | "desc" = "asc";
    if (field === sortField && sortDirection === "asc") {
      direction = "desc";
    }
    const newField: SortValue = `${field}-${direction}`;
    if (newField === DEFAULT_SORT) {
      return urlWithoutFilter(this.url, "sort");
    }
    return urlWithFilter(this.url, "sort", newField);
  }

  addSubject(id: number) {
    const subjects = this.url.searchParams.getAll("subjects");
    if (subjects.includes(id + "")) {
      return null;
    }

    return urlWithArrayFilter(this.url, "subjects", subjects.concat(id + ""));
  }
  withoutSubject(id: number) {
    const subjects = this.url.searchParams.getAll("subjects");
    const newSubjects = subjects.filter(s => s !== id + "");

    const result = urlWithArrayFilter(this.url, "subjects", newSubjects);

    if (!newSubjects.length) {
      return urlWithoutFilter(new URL(result), "child-subjects");
    }

    return result;
  }

  addTag(id: number) {
    const tags = this.url.searchParams.getAll("tags");
    if (tags.includes(id + "")) {
      return null;
    }

    return urlWithArrayFilter(this.url, "tags", tags.concat(id + ""));
  }
  withoutTag(id: number) {
    const tags = this.url.searchParams.getAll("tags");
    const newTags = tags.filter(s => s !== id + "");

    return urlWithArrayFilter(this.url, "tags", newTags);
  }
}

const urlWithoutFilter = (url: URL, filter: string) => {
  const newUrl = new URL(url);
  newUrl.searchParams.delete(filter);
  newUrl.searchParams.delete("page");
  return newUrl.toString();
};

const urlWithFilter = (url: URL, filter: string, value: string) => {
  const newUrl = new URL(url);
  newUrl.searchParams.set(filter, value);

  return newUrl.toString();
};

const urlWithArrayFilter = (url: URL, filter: string, values: string[]) => {
  const newUrl = new URL(url);

  newUrl.searchParams.delete("page");
  newUrl.searchParams.delete(filter);
  for (const s of values) {
    newUrl.searchParams.append(filter, s);
  }

  return newUrl.toString();
};
