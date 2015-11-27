const { LOAD_BOOKS, LOAD_BOOKS_RESULTS } = require('../actions/actionNames');

const initialState = () => ({
    bookList: []
});

var i = 0;

function reducer(state = initialState(), action = {}){

    switch(action.type){
        case LOAD_BOOKS:
            return Object.assign({}, state, { loading: true });
        case LOAD_BOOKS_RESULTS:
            return Object.assign({}, state, { loading: false, bookList: i++ % 2 == 0 ? action.bookList : [] });
    }

    return state;
}

module.exports = reducer;