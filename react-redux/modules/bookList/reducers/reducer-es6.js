const { booksReducer } = require('./booksReducer');
const { subjectsReducer } = require('./subjectsReducer');
const filtersReducer = require('./filtersReducer');

const actionCreators = require('../actions/actionCreators');
const { createSelector } = require('../../../util/reselect');
const { setBookResultsSubjects } = require('../util/booksSubjectsHelpers');
const { stackAndGetTopLevelSubjects } = require('../util/booksSubjectsHelpers');

const { ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK, TOGGLE_SELECT_BOOK_FOR_SUBJECT_MODIFICATION, ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS, CANCEL_SUBJECT_MODIFICATION }
    = require('../actions/actionNames');

const initialState = () => ({
    books: booksReducer(),
    subjects: subjectsReducer(),
    filters: filtersReducer()
});


const bookSubjectManagerInitialState = () => ({
    selected: {},
    addingSubjects: {},
    removingSubjects: {},
    isActive: false
});

function bookSubjectManagerReducer(state = bookSubjectManagerInitialState(), action = {}){
    switch (action.type){
        case TOGGLE_SELECT_BOOK_FOR_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { selected: { ...state.selected, [action._id]: action.selected ? action._id : undefined } });
        case ENABLE_SUBJECT_MODIFICATION_FOR_SINGLE_BOOK:
            return Object.assign({}, state, { selected: { [action._id]: true }, isActive: true });
        case ENABLE_SUBJECT_MODIFICATION_FOR_TOGGLED_BOOKS:
            return Object.assign({}, state, { isActive: true });
        case CANCEL_SUBJECT_MODIFICATION:
            return Object.assign({}, state, { isActive: false });
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
    [state => state.books.list, state => state.subjects.list],
    setBookResultsSubjects
);

const stackedSubjectsSelector = createSelector(
    [state => state.list],
    stackAndGetTopLevelSubjects
);

const bookListSelector = state => ({
    subjects: Object.assign({}, state.bookList.subjects, {list: stackedSubjectsSelector(state.bookList.subjects)}),
    books: Object.assign({}, state.bookList.books, {list: booksWithSubjectsSelector(state.bookList)}),
    filters: state.bookList.filters,
    booksSubjectsModifier: state.bookList.booksSubjectsModifier
});

module.exports = { reducer, selector: bookListSelector };