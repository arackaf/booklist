import {createSelector} from 'reselect';
import {selectBookSelection, BookSelectionType, selectBookList, BookListType} from 'modules/books/reducers/books/reducer';

import * as actionCreatorsBooks from 'modules/books/reducers/books/actionCreators';
import * as actionCreatorsEditBook from 'modules/books/reducers/editBook/actionCreators';
import * as actionCreatorsBookSearch from 'modules/books/reducers/bookSearch/actionCreators';

export const actions = { 
    ...actionCreatorsBooks, 
    ...actionCreatorsEditBook, 
    ...actionCreatorsBookSearch, 
};

export type actionsType = typeof actionCreatorsBooks & 
                          typeof actionCreatorsEditBook & 
                          typeof actionCreatorsBookSearch;

export type BookListComponentStateType = BookSelectionType & BookListType & {
    viewingPublic: boolean,
    selectedBooks: {[s: string] : any};
    hasMoreBooks: boolean;
    currentPage: (string | number);
    currentSort: string;
    sortDirection : string;
};
export const selectBookListComponentState = createSelector<any, BookListComponentStateType, any, any, any, BookListType, BookSelectionType>(
    state => state.app,
    state => state.booksModule.books,
    state => state.booksModule.bookSearch,
    selectBookList,
    selectBookSelection,
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