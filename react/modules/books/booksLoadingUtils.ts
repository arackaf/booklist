import { getCurrentHistoryState } from "reactStartup";

export const defaultSearchValuesHash = {
  search: "",
  subjects: "",
  tags: "",
  searchChildSubjects: "",
  author: "",
  publisher: "",
  pages: "",
  pagesOperator: "",
  page: 1,
  pageSize: 50,
  isRead: "",
  noSubjects: "",
  sort: "_id",
  sortDirection: "desc",
  userId: ""
};

export function filtersFromUrl(filters) {
  const { subjects: subjectsHashValue, tags: tagsHashValue } = filters;
  return Object.assign({}, defaultSearchValuesHash, filters, {
    tagIds: tagsHashValue ? tagsHashValue.split("-") : [],
    subjectIds: subjectsHashValue ? subjectsHashValue.split("-") : []
  });
}

export function bookSearchVariablesFromCurrentUrl() {
  return computeBookSearchVariables(filtersFromUrl(getCurrentHistoryState().searchState));
}

export function computeBookSearchVariables(bookSearchFilters) {
  let getBooksVariables: any = {
    page: +bookSearchFilters.page,
    pageSize: bookSearchFilters.pageSize,
    sort: {
      [bookSearchFilters.sort]: bookSearchFilters.sortDirection == "asc" ? 1 : -1
    },
    title_contains: bookSearchFilters.search || void 0,
    isRead: bookSearchFilters.isRead === "1" ? true : void 0,
    isRead_ne: bookSearchFilters.isRead === "0" ? true : void 0,
    subjects_containsAny: bookSearchFilters.subjectIds.length ? bookSearchFilters.subjectIds : void 0,
    searchChildSubjects: bookSearchFilters.searchChildSubjects == "true" ? true : void 0,
    tags_containsAny: bookSearchFilters.tagIds.length ? bookSearchFilters.tagIds : void 0,
    authors_textContains: bookSearchFilters.author || void 0,
    publisher_contains: bookSearchFilters.publisher || void 0,
    publicUserId: bookSearchFilters.userId || void 0,
    subjects_count: bookSearchFilters.noSubjects ? 0 : void 0
  };

  if (bookSearchFilters.pages != "" && bookSearchFilters.pages != null) {
    getBooksVariables[bookSearchFilters.pagesOperator == "lt" ? "pages_lt" : "pages_gt"] = +bookSearchFilters.pages;
  }

  return getBooksVariables;
}
