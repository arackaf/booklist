import shallowEqual from "shallow-equal/objects";

import { setSearchValues, getCurrentHistoryState, history } from "reactStartup";
import { getStatePacket } from "util/stateManagementHelpers";
import { useContext, useMemo, useEffect } from "react";
import { SubjectsContext, AppContext } from "app/renderUI";
import { BooksSearchContext } from "./books";
import { TagsContext } from "app/tagsState";

import localStorage from "util/localStorage";

const SET_GRID_VIEW = "booksSearch.SET_GRID_VIEW";
const SET_BASIC_LIST_VIEW = "booksSearch.SET_BasicList_VIEW";
const SET_COVERS_LIST_VIEW = "booksSearch.SET_Covers_VIEW";

const GRID_VIEW = "books table view";
const BASIC_LIST_VIEW = "books mobile view";
const COVERS_LIST = "books covers view";
const HASH_CHANGED = "books search hash changed";

const initialState = {
  view: localStorage.get("book-ui"),
  hashFilters: {} as typeof defaultSearchValuesHash
};
export type BookSearchState = typeof initialState;

export function bookSearchReducer(state = initialState, action): BookSearchState {
  switch (action.type) {
    case SET_BASIC_LIST_VIEW:
      localStorage.set("book-ui", BASIC_LIST_VIEW);
      return { ...state, view: BASIC_LIST_VIEW };
    case SET_GRID_VIEW:
      localStorage.set("book-ui", GRID_VIEW);
      return { ...state, view: GRID_VIEW };
    case SET_COVERS_LIST_VIEW:
      localStorage.set("book-ui", COVERS_LIST);
      return { ...state, view: COVERS_LIST };
    case HASH_CHANGED:
      let { filters } = action;
      if (!shallowEqual(filters, state.hashFilters)) {
        return { ...state, hashFilters: filters };
      }
      return { ...state };
  }
  return state;
}

export type TagOrSubject = {
  _id: string;
  name: string;
};
export type LookupHashType = {
  [str: string]: TagOrSubject;
};

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

export function useBooksSearchState(): [BookSearchState, any, any] {
  let actions = { setViewDesktop, setViewBasicList, setCoversList, hashChanged };
  let initialSearchState = useMemo(() => ({ ...initialState, hashFilters: getCurrentHistoryState().searchState }), []);
  let result = getStatePacket<BookSearchState>(bookSearchReducer, initialSearchState, actions);
  let dispatch = result[2];

  useEffect(() => {
    return history.listen(() => {
      const { searchState } = getCurrentHistoryState();
      dispatch(hashChanged(searchState));
    });
  }, []);

  return result;
}

export function filtersFromUrl(filters) {
  const { subjects: subjectsHashValue, tags: tagsHashValue } = filters;
  return Object.assign({}, defaultSearchValuesHash, filters, {
    tagIds: tagsHashValue ? tagsHashValue.split("-") : [],
    subjectIds: subjectsHashValue ? subjectsHashValue.split("-") : []
  });
}

export const useSelectedSubjects = () => {
  const [{ hashFilters }] = useContext(BooksSearchContext);
  const { subjects } = hashFilters;
  const { subjectHash } = useContext(SubjectsContext);

  return useMemo(() => projectSelectedItems(subjects, subjectHash), [subjects, subjectHash]);
};

export const useSelectedTags = () => {
  const [{ hashFilters }] = useContext(BooksSearchContext);
  const { tags } = hashFilters;
  const { tagHash } = useContext(TagsContext);

  return useMemo(() => projectSelectedItems(tags, tagHash), [tags, tagHash]);
};

function projectSelectedItems(ids: string = "", hash): TagOrSubject[] {
  return ids
    .split("-")
    .map(_id => (_id ? hash[_id] : null))
    .filter(res => res);
}

const keyIsFilter = k => k != "page" && k != "sort" && k != "sortDirection" && k != "userId";

export const useCurrentSearch = () => {
  const [{ hashFilters: filters }] = useContext(BooksSearchContext);
  const { subjects: subjectsHashValue, tags: tagsHashValue } = filters;

  const subjects = useSelectedSubjects();
  const tags = useSelectedTags();

  return useMemo(() => {
    let result = Object.assign({}, filtersFromUrl(filters), {
      selectedSubjects: subjects,
      selectedTags: tags
    });

    return Object.assign({}, result, {
      anyActiveFilters: !!Object.keys(filters).filter(keyIsFilter).length,
      activeFilterCount: Object.keys(filters).filter(keyIsFilter).length,
      bindableSortValue: `${result.sort}|${result.sortDirection}`
    });
  }, [filters, subjects, tags, subjectsHashValue, tagsHashValue]);
};

export const useBookSearchUiView = () => {
  let [app] = useContext(AppContext);
  let [bookSearch] = useContext(BooksSearchContext);

  let view = bookSearch.view;
  let isGridView = view == GRID_VIEW || (!view && app.showingDesktop);
  let isBasicList = view == BASIC_LIST_VIEW || (!view && app.showingMobile);
  let isCoversList = view == COVERS_LIST;

  return {
    isGridView,
    isBasicList,
    isCoversList
  };
};

const setViewDesktop = () => ({ type: SET_GRID_VIEW });
const setViewBasicList = () => ({ type: SET_BASIC_LIST_VIEW });
const setCoversList = () => ({ type: SET_COVERS_LIST_VIEW });

const hashChanged = filters => ({ type: HASH_CHANGED, filters });

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
