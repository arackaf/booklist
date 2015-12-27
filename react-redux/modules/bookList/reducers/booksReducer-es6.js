const { LOAD_BOOKS, LOAD_BOOKS_RESULTS, TOGGLE_SELECT_BOOK, SELECT_ALL_BOOKS, DE_SELECT_ALL_BOOKS } = require('../actions/actionNames');

function booksReducer(state = initialBooksState(), action = {}){
    switch(action.type) {
        case LOAD_BOOKS:
            return Object.assign({}, state, { loading: true });
        case LOAD_BOOKS_RESULTS:
            return Object.assign({}, state, { loading: false, list: action.books});
        case TOGGLE_SELECT_BOOK:
            return Object.assign({}, state, { selectedBooks: { ...state.selectedBooks, [action._id]: !state.selectedBooks[action._id] } });
        case SELECT_ALL_BOOKS:
            var newBookList = state.list.map(b => Object.assign({}, b, { selected: true }));
            return Object.assign({}, state, { list: newBookList, selectedCount: newBookList.length });
        case DE_SELECT_ALL_BOOKS:
            var newBookList = state.list.map(b => Object.assign({}, b, { selected: false }));
            return Object.assign({}, state, { list: newBookList, selectedCount: 0 });
    }
    return state;
}

const initialBooksState = () => ({
    list: [],
    loading: false,
    selectedBooks: {}
});

module.exports = { booksReducer };