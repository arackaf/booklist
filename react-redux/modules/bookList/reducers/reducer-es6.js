const { LOAD_BOOKS, LOAD_BOOKS_RESULTS } = require('../actions/actionNames');

const initialState = () => ({
    viewList: []
});

function reducer(state = initialState(), action = {}){

    switch(action.type){
        case LOAD_BOOKS:
            return state;
        case LOAD_BOOKS_RESULTS:
            return Object.assign({}, state, { bookList: action.bookList });
    }

    return state;
}

module.exports = reducer;