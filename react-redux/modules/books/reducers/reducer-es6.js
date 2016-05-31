const { booksReducer: books, booksSelector } = require('./books/reducer');
const { subjectsReducer: subjects, subjectsSelector } = require('./subjects/reducer');
const { bookSearchReducer: bookSearch, bookSearchSelector } = require('./bookSearch/reducer');
const { bookSubjectManagerReducer: booksSubjectsModifier, booksSubjectsModifierSelector } = require('./booksSubjectModification/reducer');
import bookEdit from './editBook/reducer';

const reducer = Redux.combineReducers({
    books,
    subjects,
    bookSearch,
    booksSubjectsModifier,
    bookEdit
});

const bookListSelector = state => {
    return {
        subjects: subjectsSelector(state.books),
        books: booksSelector(state.books),
        bookSearch: bookSearchSelector(state.books),
        booksSubjectsModifier: booksSubjectsModifierSelector(state.books),
        bookEdit: state.books.bookEdit //no selector on bookEdit
    }
};

module.exports = { reducer, selector: bookListSelector };