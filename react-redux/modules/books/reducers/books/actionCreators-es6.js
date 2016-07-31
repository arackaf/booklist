import { TOGGLE_SELECT_BOOK, LOAD_BOOKS, LOAD_BOOKS_RESULTS } from './actionNames';

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

export function booksResults(resp, hasMore){
    return { type: LOAD_BOOKS_RESULTS, books: resp.results, hasMore };
}