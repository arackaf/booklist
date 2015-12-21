const { booksReducer } = require('./booksReducer');
const { subjectsReducer } = require('./subjectsReducer');

const initialState = () => ({
    books: booksReducer(),
    subjects: subjectsReducer()
});

function reducer(state = initialState(), action = {}){
    return {
        books: booksReducer(state.books, state.subjects.list, action),
        subjects: subjectsReducer(state.subjects, action)
    };
}

module.exports = reducer;