import {
  TOGGLE_SELECT_BOOK,
  LOAD_BOOKS,
  LOAD_BOOKS_RESULTS,
  BOOK_READ_CHANGING,
  BOOK_READ_CHANGED,
  TOGGLE_CHECK_ALL,
  SET_PENDING_DELETE_BOOK,
  CANCEL_PENDING_DELETE_BOOK,
  BOOK_DELETING,
  BOOK_DELETED,
  EDITORIAL_REVIEWS_LOADING,
  DETAILS_LOADED,
  EXPAND_BOOK,
  COLLAPSE_BOOK
} from "./actionNames";

import { BooksModuleType } from "modules/books/reducers/reducer";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import DeleteBookMutation from "graphQL/books/deleteBook.graphql";
import UpdateBooksReadMutation from "graphQL/books/updateBooksRead.graphql";
import BookDetailsQuery from "graphQL/books/getBookDetails.graphql";

export function toggleSelectBook(_id) {
  return { type: TOGGLE_SELECT_BOOK, _id };
}

import { BookSearchType, selectCurrentSearch } from "../bookSearch/reducer";

import { graphqlClient } from "applicationRoot/rootReducerActionCreators";
import { store } from "applicationRoot/store";

export const setPendingDeleteBook = ({ _id }) => ({ type: SET_PENDING_DELETE_BOOK, _id });
export const cancelPendingDeleteBook = ({ _id }) => ({ type: CANCEL_PENDING_DELETE_BOOK, _id });
export const deleteBook = ({ _id }) => {
  return (dispatch, getState) => {
    dispatch({ type: BOOK_DELETING, _id });

    graphqlClient.runMutation(DeleteBookMutation, { _id }).then(resp => {
      dispatch({ type: BOOK_DELETED, _id });
    });
  };
};

export function loadBooks() {
  return function(dispatch, getState) {
    dispatch({ type: LOAD_BOOKS });

    let state = getState();
    let bookSearch = state.booksModule.bookSearch;
    let app = state.app;

    Promise.resolve(booksSearch(bookSearch, app.publicUserId)).then(booksResp => {
      window.scrollTo(0, 0);
      dispatch(booksResults(booksResp, booksResp.count));
    });
  };
}

function booksSearch(bookSearchState: BookSearchType, publicUserId) {
  let bookSearchFilters = selectCurrentSearch(store.getState() as any);

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
    bookSearchVersion: "" + bookSearchState.searchVersion
  };
  if (bookSearchFilters.pages != "") {
    getBooksVariables[bookSearchFilters.pagesOperator == "lt" ? "pages_lt" : "pages_gt"] = +bookSearchFilters.pages;
  }

  return graphqlClient.runQuery(GetBooksQuery, getBooksVariables).then(resp => {
    if (resp.data && resp.data.allBooks && resp.data.allBooks.Books && resp.data.allBooks.Meta) {
      return { results: resp.data.allBooks.Books, count: resp.data.allBooks.Meta.count };
    }
  });
}

export function expandBook(_id: string) {
  return (dispatch, getState: () => BooksModuleType) => {
    let allState = getState();
    let publicUserId = allState.app.publicUserId;
    let booksHash = getState().booksModule.books.booksHash;
    let book = booksHash[_id];

    if (!book.detailsLoaded) {
      dispatch({ type: EDITORIAL_REVIEWS_LOADING, _id });

      graphqlClient.runQuery(BookDetailsQuery, { _id, isBookDetails: "1", publicUserId }).then(({ data: { getBook } }) => {
        let { editorialReviews, similarBooks } = getBook.Book;
        dispatch({ type: DETAILS_LOADED, _id, editorialReviews: editorialReviews || [], similarBooks: similarBooks || [] });
      });
    } else {
      dispatch({ type: EXPAND_BOOK, _id });
    }
  };
}

export function collapseBook(_id: string) {
  return { type: COLLAPSE_BOOK, _id };
}

export function setRead(_id) {
  return function(dispatch, getState) {
    executeSetRead(dispatch, [_id], true);
  };
}

export function setUnRead(_id) {
  return function(dispatch, getState) {
    executeSetRead(dispatch, [_id], false);
  };
}

export function setSelectedRead() {
  return function(dispatch, getState) {
    let selectedBooks = getState().booksModule.books.selectedBooks,
      ids = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]);

    executeSetRead(dispatch, ids, true);
  };
}

export function setSelectedUnRead() {
  return function(dispatch, getState) {
    let selectedBooks = getState().booksModule.books.selectedBooks,
      ids = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]);

    executeSetRead(dispatch, ids, false);
  };
}

function executeSetRead(dispatch, ids, value) {
  dispatch({ type: BOOK_READ_CHANGING, _ids: ids });

  graphqlClient.runMutation(UpdateBooksReadMutation, { _ids: ids, updates: { isRead: !!value } }).then(res => {
    dispatch({ type: BOOK_READ_CHANGED, _ids: ids, value: value });
  });
}

export const booksResults = (resp, count) => ({ type: LOAD_BOOKS_RESULTS, books: resp.results, resultsCount: count });

export const toggleCheckAll = () => ({ type: TOGGLE_CHECK_ALL });
