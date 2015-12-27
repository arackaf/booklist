const { booksReducer } = require('./booksReducer');
const { subjectsReducer } = require('./subjectsReducer');
const filtersReducer = require('./filtersReducer');

const actionCreators = require('../actions/actionCreators');
const { createSelector } = require('../../../util/reselect');
const { setBookResultsSubjects } = require('../util/booksSubjectsHelpers');
const { stackAndGetTopLevelSubjects } = require('../util/booksSubjectsHelpers');

const { ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK, ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS, CANCEL_SUBJECT_MODIFICATION }
    = require('../actions/actionNames');

const initialState = () => ({
    books: booksReducer(),
    subjects: subjectsReducer(),
    filters: filtersReducer()
});


const bookSubjectManagerInitialState = () => ({
    singleBookModify: null,
    selectedBooksModify: false,
    addingSubjects: {},
    removingSubjects: {}
});

function bookSubjectManagerReducer(state = bookSubjectManagerInitialState(), action = {}){
    switch (action.type){
        case ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK:
            return Object.assign({}, state, { singleBookModify: action._id });
        case ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS:
            return Object.assign({}, state, { selectedBooksModify: true });
        case CANCEL_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { singleBookModify: null, selectedBooksModify: false });
    }
    return state;
}

function reducer(state = initialState(), action = {}){
    return {
        books: booksReducer(state.books, action),
        subjects: subjectsReducer(state.subjects, action),
        filters: filtersReducer(state.filters, action),
        booksSubjectsModifier: bookSubjectManagerReducer(state.booksSubjectsModifier, action)
    };
}

const booksWithSubjectsSelector = createSelector(
    [state => state.books.booksHash, state => state.subjects.list],
    setBookResultsSubjects
);

const stackedSubjectsSelector = createSelector(
    [state => state.list],
    stackAndGetTopLevelSubjects
);

const booksSubjectsModifierSelector = createSelector(
    [state => state.booksSubjectsModifier, state => state.books.selectedBooks],
    (subjectsModifier, selectedBooks) => ({
        singleBookModify: subjectsModifier.singleBookModify,
        selectedBooksModify: subjectsModifier.selectedBooksModify,
        addingSubjects: subjectsModifier.addingSubjects,
        modifyingBooks: subjectsModifier.modifyingBooks
    })
);

const bookListSelector = state => ({
    subjects: Object.assign({}, state.bookList.subjects, {list: stackedSubjectsSelector(state.bookList.subjects)}),
    books: Object.assign({}, state.bookList.books, {list: booksWithSubjectsSelector(state.bookList)}),
    filters: state.bookList.filters,
    booksSubjectsModifier: booksSubjectsModifierSelector(state.bookList, state.bookList)
});

module.exports = { reducer, selector: bookListSelector };