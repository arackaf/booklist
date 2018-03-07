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

import { bookSearchType } from "../bookSearch/reducer";

import { args, numArg, strArg, boolArg, strArrArg, gqlGet } from "util/graphqlUtil";

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

    let state = getState(),
      bookSearch = state.booksModule.bookSearch,
      app = state.app;

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

function booksSearch(bookSearchState: bookSearchType, publicUserId) {
  let version = bookSearchState.searchVersion;
  let bindableSortValue = !bookSearchState.sort ? "_id|desc" : `${bookSearchState.sort}|${bookSearchState.sortDirection == "1" ? "asc" : "desc"}`;
  let [sortField, sortDirection] = bindableSortValue.split("|");
  let sortObject = `{ ${sortField}: ${sortDirection == "asc" ? 1 : -1} }`;

  return gqlGet(compress`query ALL_BOOKS_V_${version} {
    allBooks(
      PAGE: ${bookSearchState.page}
      PAGE_SIZE: ${bookSearchState.pageSize}
      SORT: ${sortObject}
      ${args(
        strArg("title_contains", bookSearchState.search),
        boolArg("isRead", bookSearchState.isRead === "1" ? true : null),
        boolArg("isRead_ne", bookSearchState.isRead === "0" ? true : null),
        strArrArg("subjects_containsAny", Object.keys(bookSearchState.subjects)),
        boolArg("searchChildSubjects", bookSearchState.searchChildSubjects || null),
        strArrArg("tags_containsAny", Object.keys(bookSearchState.tags)),
        strArg("authors_textContains", bookSearchState.author),
        strArg("publisher_contains", bookSearchState.publisher),
        strArg("publicUserId", publicUserId),
        bookSearchState.pages != "" ? numArg(bookSearchState.pagesOperator == "lt" ? "pages_lt" : "pages_gt", bookSearchState.pages) : null
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
      ajaxUtil.get("/book/loadDetails", { _id }).then(resp => {
        (resp.editorialReviews || []).forEach(ev => {
          if (ev.Source) {
            ev.source = ev.Source;
          }
          if (ev.Content) {
            ev.content = ev.Content;
          }
        });
        dispatch({ type: DETAILS_LOADED, _id, editorialReviews: resp.editorialReviews });
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
