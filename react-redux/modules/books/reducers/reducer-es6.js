const { booksReducer: books, booksSelector } = require('./booksReducer');
const { subjectsReducer: subjects, subjectsSelector } = require('./subjectsReducer');
const { bookSearchReducer: bookSearch, bookSearchSelector } = require('./bookSearchReducer');
const { bookSubjectManagerReducer: booksSubjectsModifier, booksSubjectsModifierSelector } = require('./booksSubjectModifierReducer');

const reducer = Redux.combineReducers({
    books,
    subjects,
    bookSearch,
    booksSubjectsModifier
});

const bookListSelector = state => {
    return {
        subjects: subjectsSelector(state.books),
        books: booksSelector(state.books),
        bookSearch: bookSearchSelector(state.books),
        booksSubjectsModifier: booksSubjectsModifierSelector(state.books)
    }
};

module.exports = { reducer, selector: bookListSelector };