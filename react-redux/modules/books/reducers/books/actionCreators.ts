import {
  TOGGLE_SELECT_BOOK,
  LOAD_BOOKS,
  LOAD_BOOKS_RESULTS,
  BOOK_READ_CHANGING,
  BOOK_READ_CHANGED,
  TOGGLE_CHECK_ALL,
  SET_PENDING_DELETE_BOOK,
  CANCEL_PENDING_DELETE_BOOK,
  DELETE_BOOK,
  BOOK_DELETING,
  BOOK_DELETED,
  EDITORIAL_REVIEWS_LOADING,
  DETAILS_LOADED,
  EXPAND_BOOK,
  COLLAPSE_BOOK,
  SET_BOOKS_SUBJECTS,
  SET_BOOKS_TAGS,
  EDITING_BOOK_SAVED
} from "./actionNames";

import { BooksModuleType } from "modules/books/reducers/reducer";
import ajaxUtil from "util/ajaxUtil";

import { compress } from "micro-graphql-react";

export function toggleSelectBook(_id) {
  return { type: TOGGLE_SELECT_BOOK, _id };
}

import { BookSearchType, selectCurrentSearch } from "../bookSearch/reducer";

import { args, numArg, strArg, boolArg, strArrArg, gqlGet } from "util/graphqlUtil";
import { graphqlClient } from "applicationRoot/rootReducerActionCreators";
import { store } from "applicationRoot/store";

export const setPendingDeleteBook = ({ _id }) => ({ type: SET_PENDING_DELETE_BOOK, _id });
export const cancelPendingDeleteBook = ({ _id }) => ({ type: CANCEL_PENDING_DELETE_BOOK, _id });
export const deleteBook = ({ _id }) => {
  return (dispatch, getState) => {
    dispatch({ type: BOOK_DELETING, _id });

    ajaxUtil.post("/book/deleteBook", { _id }, () => {
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
      let hasMore = booksResp.results.length > bookSearch.pageSize;
      if (hasMore) {
        booksResp.results = booksResp.results.slice(0, -1);
      }
      window.scrollTo(0, 0);
      dispatch(booksResults(booksResp, hasMore, booksResp.count));
    });
  };
}

const nonEmptyProps = obj =>
  Object.keys(obj).reduce((hash, k) => {
    if ((Array.isArray(obj[k]) && obj[k].length) || (obj[k] !== "" && obj[k] != null)) {
      hash[k] = obj[k];
    }
    return hash;
  }, {});

function booksSearch(bookSearchState: BookSearchType, publicUserId) {
  let bookSearchFilters = selectCurrentSearch(store.getState() as any);
  let version = bookSearchState.searchVersion;
  let sortObject = `{ ${bookSearchFilters.sort}: ${bookSearchFilters.sortDirection == "asc" ? 1 : -1} }`;

  return gqlGet(compress`query ALL_BOOKS_V_${version} {
    allBooks(
      PAGE: ${bookSearchFilters.page}
      PAGE_SIZE: ${bookSearchFilters.pageSize}
      SORT: ${sortObject}
      ${args(
        strArg("title_contains", bookSearchFilters.search),
        boolArg("isRead", bookSearchFilters.isRead === "1" ? true : null),
        boolArg("isRead_ne", bookSearchFilters.isRead === "0" ? true : null),
        strArrArg("subjects_containsAny", Object.keys(bookSearchFilters.selectedSubjects)),
        boolArg("searchChildSubjects", bookSearchFilters.searchChildSubjects || null),
        strArrArg("tags_containsAny", Object.keys(bookSearchFilters.selectedTags)),
        strArg("authors_textContains", bookSearchFilters.author),
        strArg("publisher_contains", bookSearchFilters.publisher),
        strArg("publicUserId", publicUserId),
        numArg("subjects_count", bookSearchFilters.noSubjects ? 0 : null),
        bookSearchFilters.pages != "" ? numArg(bookSearchFilters.pagesOperator == "lt" ? "pages_lt" : "pages_gt", bookSearchFilters.pages) : null
      )}
    ){
      Books{
        _id
        title
        isbn
        ean
        pages
        smallImage
        publicationDate
        subjects
        authors
        publisher
        tags
        isRead
        dateAdded
      }, Meta {count}
    }
  }`).then(resp => {
    if (resp.data && resp.data.allBooks && resp.data.allBooks.Books && resp.data.allBooks.Meta) {
      return { results: resp.data.allBooks.Books, count: resp.data.allBooks.Meta.count };
    }
  });
}

export function expandBook(_id: string) {
  return (dispatch, getState: () => BooksModuleType) => {
    let booksHash = getState().booksModule.books.booksHash;
    let book = booksHash[_id];

    if (!book.detailsLoaded) {
      dispatch({ type: EDITORIAL_REVIEWS_LOADING, _id });

      graphqlClient
        .runQuery(
          compress`query GetBookDetails {
          getBook(_id: ${JSON.stringify(_id)}) {
            Book { editorialReviews { source, content } }
          }
        }`
        )
        .then(({ data: { getBook } }) => {
          let editorialReviews = getBook.Book.editorialReviews;
          dispatch({ type: DETAILS_LOADED, _id, editorialReviews });
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
  ajaxUtil.post("/book/setRead", { _ids: ids, isRead: value }, () => {
    dispatch({ type: BOOK_READ_CHANGED, _ids: ids, value: value });
  });
}

export const booksResults = (resp, hasMore, count) => ({ type: LOAD_BOOKS_RESULTS, books: resp.results, hasMore, resultsCount: count });

export const toggleCheckAll = () => ({ type: TOGGLE_CHECK_ALL });
