import {
    UPDATE_ISBN,
    GET_BOOK,
    GET_BOOK_RESULTS,
    BOOK_DELETED,
    BOOK_DELETING,
    SAVE_ALL_PENDING,
    GETTING_BOOKS,
    RESET_LIST,
    SET_PENDING,
    BOOK_SAVED,
    INCREMENT_PENDING,
    BOOK_QUEUED
} from '../actions/actionNames';

const initialArray = () => Array.from({ length: 10 }).map(() => ({ isbn: '', fetched: false, fetching: false }));
const initialState = {
    entryList: initialArray(),
    pendingNumber: null,
    booksJustSaved: []
};

function reducer(state = initialState, action){
    switch(action.type) {
        case UPDATE_ISBN:
            var newEntryList = state.entryList.concat();
            Object.assign(newEntryList[action.index], { isbn: action.isbn, retrieving: false, queued: false });

            return Object.assign({}, state, { entryList: newEntryList });
        case GET_BOOK:
            var updatedObject = Object.assign({}, state.entryList[action.index], { retrieving: true }),
                newEntryList = state.entryList.concat();

            newEntryList[action.index] = updatedObject;
            return Object.assign({}, state, { entryList: newEntryList });
        case BOOK_QUEUED:
            var updatedObject = Object.assign({}, state.entryList[action.index], { retrieving: false, queued: true }),
                newEntryList = state.entryList.concat();

            newEntryList[action.index] = updatedObject;
            return Object.assign({}, state, { entryList: newEntryList });
        case RESET_LIST:
            return Object.assign({}, state, { entryList: initialArray() });
        case SET_PENDING:
            return Object.assign({}, state, { pendingNumber: action.number });
        case INCREMENT_PENDING:
            return Object.assign({}, state, { pendingNumber: (state.pendingNumber || 0) + 1 });
        case BOOK_SAVED:
            return Object.assign({}, state, { booksJustSaved: [action.book].concat(state.booksJustSaved.slice(0, 3)), pendingNumber: (state.pendingNumber - 1) || 0 });
    }
    return state;
}

module.exports = reducer;