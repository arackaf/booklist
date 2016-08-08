import { TOGGLE_SELECT_BOOK, LOAD_BOOKS, LOAD_BOOKS_RESULTS, BOOK_READ_CHANGING, BOOK_READ_CHANGED } from './actionNames';

export function toggleSelectBook(_id, selected){
    return { type: TOGGLE_SELECT_BOOK, _id, selected }
}

export function loadBooks(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_BOOKS });

        let state = getState(),
            bookSearch = state.booksModule.bookSearch,
            root = state.root;

        Promise.resolve(booksSearch(bookSearch, root.publicUserId)).then(booksResp => {
            let hasMore = booksResp.results.length > bookSearch.pageSize;
            if (hasMore){
                booksResp.results = booksResp.results.slice(0, -1);
            }
            dispatch(booksResults(booksResp, hasMore));
        });
    }
}

function booksSearch(bookSearchState, publicUserId){
    return ajaxUtil.get('/book/searchBooks', {
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
        userId: publicUserId
    });
}

export function setUnRead(_id){
    return function(dispatch, getState) {
        dispatch({ type: BOOK_READ_CHANGING, _ids: [_id] });
        ajaxUtil.post('/book/setRead', { _ids: [_id], isRead: false }, () => {
            dispatch({ type: BOOK_READ_CHANGED, _ids: [_id], value: false });
        });
    };
}

export function setRead(_id){
    return function(dispatch, getState) {
        dispatch({ type: BOOK_READ_CHANGING, _ids: [_id] });
        ajaxUtil.post('/book/setRead', { _ids: [_id], isRead: true }, () => {
            dispatch({ type: BOOK_READ_CHANGED, _ids: [_id], value: true });
        });
    };
}

export function setSelectedRead(){
    return function(dispatch, getState){
        let selectedBooks = getState().booksModule.selectedBooks,
            ids = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]);

        dispatch({ type: BOOK_READ_CHANGING, _ids: ids });
        ajaxUtil.post('/book/setRead', { _ids: ids, isRead: true }, () => {
            dispatch({ type: BOOK_READ_CHANGED, _ids: ids, value: true });
        });
    }
}

export function booksResults(resp, hasMore){
    return { type: LOAD_BOOKS_RESULTS, books: resp.results, hasMore };
}