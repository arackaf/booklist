const { LOAD_BOOKS, LOAD_BOOKS_RESULTS } = require('./actionNames');

function loadBooks(){
    return function(dispatch, getState){
        dispatch({ type: LOAD_BOOKS });

        ajaxUtil.get('/book/searchBooks', { }, resp => {
            dispatch({ type: LOAD_BOOKS_RESULTS, bookList: resp.results });
        });
    }
}

module.exports = {
    loadBooks
};

