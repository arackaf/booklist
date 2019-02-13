import { BOOK_SEARCH_VERSION_KEY, hashOf, getSearchVersion, getStatePacket, graphqlClient } from "applicationRoot/rootReducer";
import update from "immutability-helper";
import { bulkMerge } from "util/immutableHelpers";
import shallowEqual from "shallow-equal/objects";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import DeleteBookMutation from "graphQL/books/deleteBook.graphql";
import UpdateBooksReadMutation from "graphQL/books/updateBooksRead.graphql";
import BookDetailsQuery from "graphQL/books/getBookDetails.graphql";
import { BookSearchType } from "./booksSearchState";
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

let initialSearchVersion = getSearchVersion(BOOK_SEARCH_VERSION_KEY);

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
  booksLoading: false,
  selectedBooks: {} as { [s: string]: boolean },
  resultsCount: 0,
  reloadOnActivate: false,
  searchVersion: initialSearchVersion
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
    //TODO:
    // case BOOK_SAVED:
    // case MANUAL_BOOK_SAVED:
    //   return { ...state, reloadOnActivate: true };
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

  //TODO:
  // case BOOK_SAVED:
  // case BOOK_READ_CHANGED:
  // case BOOK_DELETED:
  // case MANUAL_BOOK_SAVED:
  // case EDITING_BOOK_SAVED:
  // case SET_BOOKS_SUBJECTS:
  // case SET_BOOKS_TAGS:
  // case NEW_LOGIN:
  //   let newSearchVersion = +new Date();
  //   localStorage.setItem(BOOK_SEARCH_VERSION_KEY, "" + newSearchVersion);
  //   return { ...state, searchVersion: newSearchVersion };

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

export const loadBooks = (app: AppState) => dispatch => {
  dispatch({ type: LOAD_BOOKS });

  Promise.resolve(booksSearch(app.publicUserId, app.online)).then(booksResp => {
    window.scrollTo(0, 0);
    dispatch(booksResults(booksResp, booksResp.count));
  });
};

function booksSearch(publicUserId, online) {
  //let bookSearchFilters = selectCurrentSearch(store.getState() as any);
  let bookSearchFilters: any = { page: 1, pageSize: 50, subjectIds: [], tagIds: [], searchVersion: "", sort: "_id" };

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
    ver: "" + bookSearchFilters.searchVersion,
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
  let actions = { loadBooks };
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
