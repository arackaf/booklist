import { hashOf, getStatePacket, graphqlClient } from "applicationRoot/rootReducer";
import update from "immutability-helper";
import { bulkMerge } from "util/immutableHelpers";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import DeleteBookMutation from "graphQL/books/deleteBook.graphql";
import UpdateBooksReadMutation from "graphQL/books/updateBooksRead.graphql";
import BookDetailsQuery from "graphQL/books/getBookDetails.graphql";
import { useCurrentSearch } from "./booksSearchState";
import { AppState } from "applicationRoot/appState";
import { useMemo, useContext } from "react";
import { SubjectsContext } from "applicationRoot/renderUI";
import { TagsContext, BooksContext } from "./components/bookViewList";

const LOAD_BOOKS = "LOAD_BOOKS";
const LOAD_BOOKS_RESULTS = "LOAD_BOOKS_RESULTS";
const TOGGLE_SELECT_BOOK = "TOGGLE_SELECT_BOOK";
const BOOK_READ_CHANGING = "BOOK_READ_CHANGING";
const BOOK_READ_CHANGED = "BOOK_READ_CHANGED";
const TOGGLE_CHECK_ALL = "TOGGLE_CHECK_ALL";

const SET_PENDING_DELETE_BOOK = "SET_PENDING_DELETE_BOOK";
const CANCEL_PENDING_DELETE_BOOK = "CANCEL_PENDING_DELETE_BOOK";
const DELETE_BOOK = "DELETE_BOOK";
const BOOK_DELETING = "BOOK_DELETING";
const BOOK_DELETED = "BOOK_DELETED";

const SET_BOOKS_SUBJECTS = "SET_BOOKS_SUBJECTS";
const SET_BOOKS_TAGS = "SET_BOOKS_TAGS";

const EDITORIAL_REVIEWS_LOADING = "LOADING_EDITORIAL_REVIEWS";
const DETAILS_LOADED = "EDITORIAL_REVIEWS_LOADED";
const EXPAND_BOOK = "EXPAND_BOOK";
const COLLAPSE_BOOK = "COLLAPSE_BOOK";

const EDITING_BOOK_SAVED = "EDITING_BOOK_SAVED";

interface IEditorialReview {
  content: string;
  source: string;
}

interface IBookSummary {
  title: string;
  asin: string;
  authors: string[];
  smallImage: string;
}

export interface IBookRaw {
  _id: string;
  dateAdded: number;
  ean: string;
  editorialReviews: IEditorialReview[];
  similarBooks: IBookSummary[];
  isRead: boolean;
  readChanging?: boolean;
  isbn: string;
  smallImage: string;
  mediumImage: string;
  pages: any;
  publicationDate: any;
  publisher: string;
  authors: string[];
  subjects: string[];
  tags: string[];
  title: string;
  titleLower: string;
  userId: string;
  deleting?: boolean;
  pendingDelete?: boolean;
  expanded: boolean;
  detailsLoaded: boolean;
  detailsLoading: boolean;
}

export interface IBookDisplay extends IBookRaw {
  subjectObjects: any[];
  tagObjects: any[];
  dateAddedDisplay: string;
}

const initialBooksState = {
  booksHash: hashOf<IBookRaw>(),
  booksLoading: true,
  selectedBooks: {} as { [s: string]: boolean },
  resultsCount: 0,
  reloadOnActivate: false
};
export type BooksState = typeof initialBooksState;

export function booksReducer(state = initialBooksState, action): BooksState {
  switch (action.type) {
    case LOAD_BOOKS:
      return { ...state, booksLoading: true, reloadOnActivate: false };
    case LOAD_BOOKS_RESULTS:
      return { ...state, booksLoading: false, selectedBooks: {}, booksHash: createBooksHash(action.books), resultsCount: action.resultsCount };
    case EDITING_BOOK_SAVED:
      return update(state, { booksHash: { [action.book._id]: { $merge: action.book } } });
    case TOGGLE_SELECT_BOOK:
      return update(state, { selectedBooks: { [action._id]: { $set: !state.selectedBooks[action._id] } } });
    case SET_BOOKS_SUBJECTS: {
      let remove = new Set<string>(action.remove);
      return update(state, {
        booksHash: {
          ...action.books.reduce(
            (hash, _id) => (
              (hash[_id] = {
                subjects: { $apply: currentSubjects => Array.from(new Set(currentSubjects.filter(t => !remove.has(t)).concat(action.add))) }
              }),
              hash
            ),
            {}
          )
        }
      });
    }
    case SET_BOOKS_TAGS: {
      let remove = new Set<string>(action.remove);
      return update(state, {
        booksHash: {
          ...action.books.reduce(
            (hash, _id) => (
              (hash[_id] = {
                tags: { $apply: currentTags => Array.from(new Set(currentTags.filter(t => !remove.has(t)).concat(action.add))) }
              }),
              hash
            ),
            {}
          )
        }
      });
    }

    case BOOK_READ_CHANGING:
      return update(state, { booksHash: bulkMerge(action._ids, { readChanging: true }) });
    case BOOK_READ_CHANGED:
      return update(state, { booksHash: bulkMerge(action._ids, { readChanging: false, isRead: action.value }) });
    case TOGGLE_CHECK_ALL:
      let selectedCount = Object.keys(state.selectedBooks).filter(k => state.selectedBooks[k]).length,
        allBooksCount = Object.keys(state.booksHash).length,
        willSelectAll = !selectedCount || (selectedCount && allBooksCount != selectedCount);

      return update(state, {
        selectedBooks: { $set: willSelectAll ? Object.keys(state.booksHash).reduce((hash, _id) => ((hash[_id] = true), hash), {}) : {} }
      });
    case SET_PENDING_DELETE_BOOK:
      return update(state, { booksHash: { [action._id]: { $merge: { pendingDelete: true } } } });
    case CANCEL_PENDING_DELETE_BOOK:
      return update(state, { booksHash: { [action._id]: { $merge: { pendingDelete: false } } } });
    case BOOK_DELETING:
      return update(state, { booksHash: { [action._id]: { $merge: { deleting: true } } } });
    case BOOK_DELETED:
      return update(state, { booksHash: { $unset: [action._id] } });
    case EDITORIAL_REVIEWS_LOADING:
      return update(state, { booksHash: { [action._id]: { $merge: { detailsLoading: true } } } });
    case EXPAND_BOOK:
      return update(state, { booksHash: { [action._id]: { $merge: { expanded: true } } } });
    case COLLAPSE_BOOK:
      return update(state, { booksHash: { [action._id]: { $merge: { expanded: false } } } });
    case DETAILS_LOADED:
      return update(state, {
        booksHash: {
          [action._id]: {
            $merge: {
              detailsLoading: false,
              detailsLoaded: true,
              expanded: true,
              similarBooks: action.similarBooks,
              editorialReviews: action.editorialReviews
            }
          }
        }
      });
  }

  return state;
}

function createBooksHash(booksArr) {
  let result = {};
  booksArr.forEach(book => {
    if (!book.subjects) {
      book.subjects = [];
    }
    if (!book.tags) {
      book.tags = [];
    }
    result[book._id] = book;
  });
  return result;
}

export const loadBooks = (bookSearchFilters, app: AppState) => dispatch => {
  dispatch({ type: LOAD_BOOKS });

  Promise.resolve(booksSearch(bookSearchFilters, app.publicUserId, app.online)).then(booksResp => {
    window.scrollTo(0, 0);
    dispatch(booksResults(booksResp, booksResp.count));
  });
};

function booksSearch(bookSearchFilters, publicUserId, online) {
  let getBooksVariables: any = {
    page: +bookSearchFilters.page,
    pageSize: bookSearchFilters.pageSize,
    sort: { [bookSearchFilters.sort]: bookSearchFilters.sortDirection == "asc" ? 1 : -1 },
    title_contains: bookSearchFilters.search || void 0,
    isRead: bookSearchFilters.isRead === "1" ? true : void 0,
    isRead_ne: bookSearchFilters.isRead === "0" ? true : void 0,
    subjects_containsAny: bookSearchFilters.subjectIds.length ? bookSearchFilters.subjectIds : void 0,
    searchChildSubjects: bookSearchFilters.searchChildSubjects == "true" ? true : void 0,
    tags_containsAny: bookSearchFilters.tagIds.length ? bookSearchFilters.tagIds : void 0,
    authors_textContains: bookSearchFilters.author || void 0,
    publisher_contains: bookSearchFilters.publisher || void 0,
    publicUserId: publicUserId,
    subjects_count: bookSearchFilters.noSubjects ? 0 : void 0,
    cache: online ? 1 : void 0
  };

  if (bookSearchFilters.pages != "" && bookSearchFilters.pages != null) {
    getBooksVariables[bookSearchFilters.pagesOperator == "lt" ? "pages_lt" : "pages_gt"] = +bookSearchFilters.pages;
  }

  return graphqlClient.runQuery(GetBooksQuery, getBooksVariables).then(resp => {
    if (resp.data && resp.data.allBooks && resp.data.allBooks.Books) {
      return { results: resp.data.allBooks.Books, count: resp.data.allBooks.Meta ? resp.data.allBooks.Meta.count : -1 };
    }
  });
}

export const booksResults = (resp, count) => ({ type: LOAD_BOOKS_RESULTS, books: resp.results, resultsCount: count });

export function useBooksState(): [BooksState, any, any] {
  let actions = {
    loadBooks,
    toggleSelectBook,
    collapseBook,
    expandBook,
    setPendingDeleteBook,
    cancelPendingDeleteBook,
    deleteBook,
    setUnRead,
    setRead,
    setSelectedRead,
    setSelectedUnRead,
    setBooksSubjects
  };
  return getStatePacket<BooksState>(booksReducer, initialBooksState, actions);
}

export const useBookList = () => {
  let [{ subjectHash }] = useContext(SubjectsContext);
  let [{ tagHash }] = useContext(TagsContext);
  let [{ booksHash, booksLoading }] = useContext(BooksContext);

  return useMemo(() => {
    let books = Object.keys(booksHash).map(_id => ({ ...booksHash[_id] }));
    books.forEach((b: IBookDisplay) => {
      b.subjectObjects = (b.subjects || []).map(s => subjectHash[s]).filter(s => s);
      b.tagObjects = (b.tags || []).map(s => tagHash[s]).filter(s => s);
      b.authors = b.authors || [];

      let d = new Date(+b.dateAdded);
      b.dateAddedDisplay = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    });
    return { booksList: books as IBookDisplay[], booksLoading };
  }, [booksHash, booksLoading, subjectHash, tagHash]);
};

export const useBookSelection = () => {
  let [{ booksHash, selectedBooks }] = useContext(BooksContext);

  return useMemo(() => {
    let selectedIds = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]).length;
    return {
      allAreChecked: Object.keys(booksHash).length == selectedIds,
      selectedBooksCount: selectedIds,
      selectedBookHash: selectedBooks
    };
  }, [booksHash, selectedBooks]);
};

export const useBookLoadingInfo = () => {
  const [booksModule] = useBooksState();
  const bookSearch = useCurrentSearch();

  const totalPages = Math.ceil(booksModule.resultsCount / bookSearch.pageSize);
  return { resultsCount: booksModule.resultsCount, booksLoading: booksModule.booksLoading, totalPages };
};

// ----- actions -----

export function toggleSelectBook(_id) {
  return { type: TOGGLE_SELECT_BOOK, _id };
}

export function setRead(_id) {
  return function(dispatch) {
    executeSetRead(dispatch, [_id], true);
  };
}

export function setUnRead(_id) {
  return function(dispatch) {
    executeSetRead(dispatch, [_id], false);
  };
}

function executeSetRead(dispatch, ids, value) {
  dispatch({ type: BOOK_READ_CHANGING, _ids: ids });

  graphqlClient.runMutation(UpdateBooksReadMutation, { _ids: ids, updates: { isRead: !!value } }).then(res => {
    dispatch({ type: BOOK_READ_CHANGED, _ids: ids, value: value });
  });
}

function expandBook(_id, publicUserId) {
  return (dispatch, getState: () => BooksState) => {
    let booksHash = getState().booksHash;
    let book = booksHash[_id];

    if (!book.detailsLoaded) {
      dispatch({ type: EDITORIAL_REVIEWS_LOADING, _id });

      graphqlClient.runQuery(BookDetailsQuery, { _id, publicUserId, cache: 9 }).then(({ data: { getBook } }) => {
        let { editorialReviews, similarBooks } = getBook.Book;
        dispatch({ type: DETAILS_LOADED, _id, editorialReviews: editorialReviews || [], similarBooks: similarBooks || [] });
      });
    } else {
      dispatch({ type: EXPAND_BOOK, _id });
    }
  };
}

function collapseBook(_id: string) {
  return { type: COLLAPSE_BOOK, _id };
}

const setPendingDeleteBook = ({ _id }) => ({ type: SET_PENDING_DELETE_BOOK, _id });
const cancelPendingDeleteBook = ({ _id }) => ({ type: CANCEL_PENDING_DELETE_BOOK, _id });
const deleteBook = ({ _id }) => {
  return dispatch => {
    dispatch({ type: BOOK_DELETING, _id });

    graphqlClient.runMutation(DeleteBookMutation, { _id }).then(resp => {
      dispatch({ type: BOOK_DELETED, _id });
    });
  };
};

const setSelectedRead = () => (dispatch, getState: () => BooksState) => {
  const selectedBooks = getState().selectedBooks;
  const ids = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]);

  executeSetRead(dispatch, ids, true);
};

const setSelectedUnRead = () => (dispatch, getState: () => BooksState) => {
  const selectedBooks = getState().selectedBooks;
  const ids = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]);

  executeSetRead(dispatch, ids, false);
};

const setBooksSubjects = ({ books, add, remove }) => ({ type: SET_BOOKS_SUBJECTS, books, add, remove });
