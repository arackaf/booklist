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
    SET_BOOKS_SUBJECTS
} from './actionNames';

import {BooksModuleType} from 'modules/books/reducers/reducer';
import ajaxUtil from 'util/ajaxUtil';

export function toggleSelectBook(_id){
    return { type: TOGGLE_SELECT_BOOK, _id }
}

export const setPendingDeleteBook = ({ _id }) => ({ type: SET_PENDING_DELETE_BOOK, _id });
export const cancelPendingDeleteBook = ({ _id }) => ({ type: CANCEL_PENDING_DELETE_BOOK, _id });
export const deleteBook = ({ _id }) => {
    return (dispatch, getState) => {
        dispatch({ type: BOOK_DELETING, _id });
        
        ajaxUtil.post('/book/deleteBook', {_id}, () => {
            dispatch({type: BOOK_DELETED, _id});
        });
    }
}

export function loadBooks(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_BOOKS });

        let state = getState(),
            bookSearch = state.booksModule.bookSearch,
            app = state.app;

        Promise.resolve(booksSearch(bookSearch, app.publicUserId)).then(booksResp => {
            let hasMore = booksResp.results.length > bookSearch.pageSize;
            if (hasMore){
                booksResp.results = booksResp.results.slice(0, -1);
            }
            window.scrollTo(0, 0);
            dispatch(booksResults(booksResp, hasMore, booksResp.count));
        });
    }
}

function booksSearch(bookSearchState, publicUserId){
    return ajaxUtil.post('/book/searchBooks', {
        page: bookSearchState.page,
        pageSize: bookSearchState.pageSize,
        search: bookSearchState.search,
        subjects: Object.keys(bookSearchState.subjects),
        tags: Object.keys(bookSearchState.tags),
        searchChildSubjects: bookSearchState.searchChildSubjects,
        sort: bookSearchState.sort,
        sortDirection: bookSearchState.sortDirection,
        author: bookSearchState.author,
        publisher: bookSearchState.publisher,
        pages: bookSearchState.pages,
        pagesOperator: bookSearchState.pagesOperator,
        userId: publicUserId,
        isRead: bookSearchState.isRead
    });
}

export function expandBook(_id : string){
    return (dispatch, getState : () => BooksModuleType) => {
        let booksHash = getState().booksModule.books.booksHash;
        let book = booksHash[_id];

        if (!book.detailsLoaded){
            dispatch({type: EDITORIAL_REVIEWS_LOADING, _id});
            ajaxUtil.get('/book/loadDetails', { _id }).then(resp => {
                (resp.editorialReviews || []).forEach(ev => {
                    if (ev.Source){
                        ev.source = ev.Source;
                    }
                    if (ev.Content){
                        ev.content = ev.Content;
                    }
                })
                dispatch({ type: DETAILS_LOADED, _id, editorialReviews: resp.editorialReviews });
            });
        } else {
            dispatch({type: EXPAND_BOOK, _id})
        }
    }
}

export function collapseBook(_id : string){
    return {type: COLLAPSE_BOOK, _id}
}

export function setRead(_id){
    return function(dispatch, getState) {
        executeSetRead(dispatch, [_id], true);
    };
}

export function setUnRead(_id){
    return function(dispatch, getState) {
        executeSetRead(dispatch, [_id], false);
    };
}

export function setSelectedRead(){
    return function(dispatch, getState){
        let selectedBooks = getState().booksModule.books.selectedBooks,
            ids = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]);

        executeSetRead(dispatch, ids, true);
    }
}

export function setSelectedUnRead(){
    return function(dispatch, getState){
        let selectedBooks = getState().booksModule.books.selectedBooks,
            ids = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]);

        executeSetRead(dispatch, ids, false);
    }
}

function executeSetRead(dispatch, ids, value){
    dispatch({ type: BOOK_READ_CHANGING, _ids: ids });
    ajaxUtil.post('/book/setRead', { _ids: ids, isRead: value }, () => {
        dispatch({ type: BOOK_READ_CHANGED, _ids: ids, value: value });
    });
}

export const booksResults = (resp, hasMore, count) => ({ type: LOAD_BOOKS_RESULTS, books: resp.results, hasMore, resultsCount: count });

export const toggleCheckAll = () => ({ type: TOGGLE_CHECK_ALL });

export function setBooksSubjects(books, add, remove){
    return function(dispatch, getState){
        return ajaxUtil.post('/bookBulk/setSubjects', { books, add, remove }, resp => {
            dispatch({ type: SET_BOOKS_SUBJECTS, books, add, remove });
        });
    }
}