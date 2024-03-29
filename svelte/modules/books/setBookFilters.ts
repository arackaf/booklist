import { setSearchValues, getCurrentUrlState } from "util/urlHelpers";

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

export const addFilterSubject = _id => {
  let hashFilters = getCurrentUrlState().searchState;
  let subjects = (hashFilters.subjects || "").split("-").filter(s => s);
  if (subjects.find(s => s == _id)) {
    return;
  }

  setSearchValues({ page: null, subjects: subjects.concat(_id).join("-") });
};

export const removeFilterSubject = _id => {
  let hashFilters = getCurrentUrlState().searchState;
  let existingSubjects = hashFilters.subjects.split("-").filter(s => s);
  let newSubjects = existingSubjects.filter(sId => sId != _id);
  let newFilters: any = {
    page: null,
    subjects: newSubjects.join("-")
  };
  if (!newSubjects.length) {
    newFilters.searchChildSubjects = null;
  }

  setSearchValues(newFilters);
};

export const addFilterTag = _id => {
  let hashFilters = getCurrentUrlState().searchState;
  let tags = (hashFilters.tags || "").split("-").filter(s => s);
  if (tags.find(s => s == _id)) {
    return;
  }

  setSearchValues({ page: null, tags: tags.concat(_id).join("-") });
};

export const removeFilterTag = _id => {
  let hashFilters = getCurrentUrlState().searchState;
  let existingTags = hashFilters.tags.split("-").filter(t => t);

  let newTags = existingTags.filter(tId => tId != _id);

  setSearchValues({ page: null, tags: newTags.join("-") });
};

export const clearSearchChildSubjects = () => setSearchValues({ searchChildSubjects: null });

export const quickSearch = val => setSearchValues({ page: null, search: val });

export const pageOne = () => {
  setSearchValues({ page: null });
};

export const setPage = page => setSearchValues({ page: page == 1 ? null : page });
