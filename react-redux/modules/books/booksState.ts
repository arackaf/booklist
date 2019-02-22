import { graphqlClient } from "applicationRoot/rootReducer";
import update from "immutability-helper";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import DeleteBookMutation from "graphQL/books/deleteBook.graphql";
import UpdateBooksReadMutation from "graphQL/books/updateBooksRead.graphql";
import BookDetailsQuery from "graphQL/books/getBookDetails.graphql";
import { useCurrentSearch } from "./booksSearchState";
import { useMemo, useContext, createContext } from "react";
import { SubjectsContext, AppContext } from "applicationRoot/renderUI";
import { TagsContext } from "./components/bookViewList";
import { useQuery, buildQuery, useMutation, buildMutation } from "micro-graphql-react";
import { syncResults } from "applicationRoot/graphqlHelpers";

const LOAD_BOOKS_RESULTS = "LOAD_BOOKS_RESULTS";
const TOGGLE_SELECT_BOOK = "TOGGLE_SELECT_BOOK";
const BOOK_READ_CHANGING = "BOOK_READ_CHANGING";
const BOOK_READ_CHANGED = "BOOK_READ_CHANGED";

const SET_PENDING_DELETE_BOOK = "SET_PENDING_DELETE_BOOK";
const CANCEL_PENDING_DELETE_BOOK = "CANCEL_PENDING_DELETE_BOOK";
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
  selectedBooks: {} as { [s: string]: boolean },
  resultsCount: 0,
  reloadOnActivate: false
};
export type BooksState = typeof initialBooksState & { booksHash: any };

export function booksReducer(state = initialBooksState, action): BooksState {
  switch (action.type) {
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

  return state as any;
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

export const useBooks = () => {
  const [app] = useContext(AppContext);
  const searchState = useCurrentSearch();

  const variables = getBookSearchVariables(searchState, app.publicUserId, app.online);
  const onBooksMutation = {
    when: /updateBooks?/,
    run: ({ currentResults, softReset }, resp) => {
      syncResults(currentResults.allBooks, "Books", resp.updateBooks ? resp.updateBooks.Books : [resp.updateBook.Book]);
      softReset(currentResults);
    }
  };
  const { data, loading, loaded, currentQuery } = useQuery(buildQuery(GetBooksQuery, variables, { onMutation: onBooksMutation }));
  const { runMutation: setBooksRead } = useMutation(buildMutation(UpdateBooksReadMutation));
  const setReadStatus = (_ids, isRead) => {
    setBooksRead({ _ids, isRead });
  };

  const allBooksPacket = data && data.allBooks;
  const Books = allBooksPacket && allBooksPacket.Books;
  const booksHash = useMemo(() => (Books ? createBooksHash(data.allBooks.Books) : {}), [Books]);

  const resultsCount = allBooksPacket && allBooksPacket.Meta ? data.allBooks.Meta.count : -1;
  const totalPages = useMemo(() => (resultsCount && resultsCount > 0 ? Math.ceil(resultsCount / searchState.pageSize) : 0), [resultsCount]);

  return {
    currentQuery,
    booksHash,
    resultsCount,
    totalPages,
    booksLoading: loading,
    setReadStatus
  };
};

function getBookSearchVariables(bookSearchFilters, publicUserId, online) {
  return useMemo(() => {
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

    return getBooksVariables;
  }, [bookSearchFilters, publicUserId]);
}

export const booksResults = (resp, count) => ({ type: LOAD_BOOKS_RESULTS, books: resp.results, resultsCount: count });
export const BooksContext = createContext<ReturnType<typeof useBooks>>(null);

export const useBookList = () => {
  let [{ subjectHash }] = useContext(SubjectsContext);
  let [{ tagHash }] = useContext(TagsContext);
  let { booksHash, booksLoading } = useContext(BooksContext);

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

// ----- actions -----

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
