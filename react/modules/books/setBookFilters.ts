import { setSearchValues, getCurrentHistoryState } from "reactStartup";

export const applyFilters = (nextState: any) => {
  let filterSubjectsVal = nextState.subjects.join("-");

  setSearchValues({
    page: null,
    search: nextState.search,
    subjects: filterSubjectsVal,
    tags: nextState.tags.join("-"),
    searchChildSubjects: nextState.searchChildSubjects && filterSubjectsVal ? "true" : null,
    author: nextState.author,
    publisher: nextState.publisher,
    pagesOperator: nextState.pages != "" ? nextState.pagesOperator : null,
    pages: nextState.pages,
    isRead: nextState.isRead,
    noSubjects: nextState.noSubjects ? "true" : "",
    sort: nextState.sort,
    sortDirection: nextState.sortDirection
  });
};

export const clearAllFilters = () => {
  setSearchValues({
    page: null,
    search: "",
    subjects: "",
    tags: "",
    searchChildSubjects: null,
    author: "",
    publisher: "",
    pagesOperator: null,
    pages: "",
    isRead: "",
    noSubjects: ""
  });
};

export const setBooksSort = (sort, sortDirection) => {
  if (sort == "_id" && sortDirection == "desc") {
    setSearchValues({
      sort: "",
      sortDirection: "",
      page: null
    });
  } else {
    setSearchValues({
      sort: sort,
      sortDirection,
      page: null
    });
  }
};

export const removeFilters = (...names) => {
  setSearchValues(names.concat("page").reduce((hash, item) => ((hash[item] = ""), hash), {}));
};

export const removeFilterSubject = _id => {
  let hashFilters = getCurrentHistoryState().searchState;
  let existingSubjects = hashFilters.subjects.split("-").filter(s => s);
  let newSubjects = existingSubjects.filter(sId => sId != _id);
  let newFilters: any = {
    subjects: newSubjects.join("-")
  };
  if (!newSubjects.length) {
    newFilters.searchChildSubjects = null;
  }

  setSearchValues(newFilters);
};

export const removeFilterTag = _id => {
  let hashFilters = getCurrentHistoryState().searchState;
  let existingTags = hashFilters.tags.split("-").filter(t => t);

  let newTags = existingTags.filter(tId => tId != _id);

  setSearchValues({ tags: newTags.join("-") });
};

export const clearSearchChildSubjects = () => setSearchValues({ searchChildSubjects: null });

export const quickSearch = val => setSearchValues({ page: null, search: val });

export const pageOne = () => {
  setSearchValues({ page: null });
};

export const setPage = page => setSearchValues({ page: page == 1 ? null : page });
