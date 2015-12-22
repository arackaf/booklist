const { booksReducer } = require('./booksReducer');
const { subjectsReducer } = require('./subjectsReducer');
const filtersReducer = require('./filtersReducer');

const initialState = () => ({
    books: booksReducer(),
    subjects: subjectsReducer(),
    filters: filtersReducer()
});

function reducer(state = initialState(), action = {}){
    return {
        books: booksReducer(state.books, action),
        subjects: subjectsReducer(state.subjects, action),
        filters: filtersReducer(state.filters, action)
    };
}

module.exports = reducer;