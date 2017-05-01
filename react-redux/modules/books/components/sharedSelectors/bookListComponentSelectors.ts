import {createSelector} from 'reselect';
import {selectBookSelection, bookSelectionType, selectBookList, booksListType} from 'modules/books/reducers/books/reducer';

import * as actionCreatorsBooks from 'modules/books/reducers/books/actionCreators';
import * as actionCreatorsEditBook from 'modules/books/reducers/editBook/actionCreators';
import * as actionCreatorsBookSearch from 'modules/books/reducers/bookSearch/actionCreators';
import * as actionCreatorsBookSubjectModification from 'modules/books/reducers/booksSubjectModification/actionCreators';
import * as actionCreatorsBookTagModification from 'modules/books/reducers/booksTagModification/actionCreators';

export const actions = { 
    ...actionCreatorsBooks, 
    ...actionCreatorsBookSubjectModification, 
    ...actionCreatorsEditBook, 
    ...actionCreatorsBookSearch, 
    ...actionCreatorsBookTagModification 
};

export type actionsType = typeof actionCreatorsBooks & 
                             typeof actionCreatorsBookSubjectModification & 
                             typeof actionCreatorsEditBook & 
                             typeof actionCreatorsBookSearch & 
                             typeof actionCreatorsBookTagModification;

export type bookListComponentStateType = bookSelectionType & booksListType & {
    viewingPublic: boolean,
    selectedBooks: {[s: string] : any};
    hasMoreBooks: boolean;
    currentPage: (string | number);
    currentSort: string;
    sortDirection : string;
};
export const selectBookListComponentState = createSelector<any, bookListComponentStateType, any, any, any, booksListType, bookSelectionType>(
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