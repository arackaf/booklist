import { TOGGLE_SELECT_BOOK, LOAD_BOOKS, LOAD_BOOKS_RESULTS } from './actionNames';

export function toggleSelectBook(_id, selected){
    return { type: TOGGLE_SELECT_BOOK, _id, selected }
}

export function loadBooks(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_BOOKS });

        Promise.resolve(booksSearch(getState().books.bookSearch)).then(booksResp => dispatch(booksResults(booksResp)));
    }
}

function booksSearch(bookSearchState){
    return ajaxUtil.get('/book/searchBooks', {
        search: bookSearchState.search,
        subjects: Object.keys(bookSearchState.subjects),
        searchChildSubjects: bookSearchState.searchChildSubjects,
        sort: bookSearchState.sort,
        sortDirection: bookSearchState.sortDirection,
        author: bookSearchState.author,
        publisher: bookSearchState.publisher,
        pages: bookSearchState.pages,
        pagesOperator: bookSearchState.pagesOperator,
        userId: bookSearchState.userId,
        userIdd: 'hello world',
        xxx: 'xxx',
    });
}

export function booksResults(resp){
    return { type: LOAD_BOOKS_RESULTS, books: resp.results };
}