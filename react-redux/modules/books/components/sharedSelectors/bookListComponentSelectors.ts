import {createSelector} from 'reselect';
import {bookSelectionSelector, bookSelectionType, booksListSelector, booksListType} from 'modules/books/reducers/books/reducer';

export type selectBookListType = bookSelectionType & booksListType & {
    viewingPublic: boolean,
    selectedBooks: {[s: string] : any};
    hasMoreBooks: boolean;
    currentPage: (string | number);
    currentSort: string;
    sortDirection : string;
};
export const selectBookList = createSelector<any, selectBookListType, any, any, any, booksListType, bookSelectionType>(
    state => state.app,
    state => state.booksModule.books,
    state => state.booksModule.bookSearch,
    booksListSelector,
    bookSelectionSelector,
    (app, books, bookSearch, bookListSelected, bookSelectionSelected) => {

        return {
            viewingPublic: app.isPublic,

            ...bookListSelected,
            ...bookSelectionSelected,
            selectedBooks: books.selectedBooks,
            
            hasMoreBooks: bookSearch.hasMore,
            currentPage: bookSearch.page,
            currentSort: bookSearch.sort,
            sortDirection: bookSearch.sortDirection,
        };
});
