import {
    UPDATE_ISBN,
    GET_BOOK,
    SAVE_ALL_PENDING,
    RESET_LIST,
    SET_PENDING,
    BOOK_SAVED,
    INCREMENT_PENDING,
    BOOK_QUEUED,
    BOOK_LOOKUP_FAILED
} from './actionNames';

const initialArray = () => Array.from({ length: 10 }).map(() => ({ isbn: '', queued: false, queueing: false }));
const initialState = {
    entryList: initialArray(),
    pendingNumber: null,
    booksJustSaved: []
};

const MAX_BOOKS_DISPLAYED = 20;

export default function reducer(state = initialState, action){
    switch(action.type) {
        case UPDATE_ISBN:
            var newEntryList = state.entryList.concat();
            Object.assign(newEntryList[action.index], { isbn: action.isbn, queueing: false, queued: false });

            return Object.assign({}, state, { entryList: newEntryList });
        case GET_BOOK:
            var updatedObject = Object.assign({}, state.entryList[action.index], { queueing: true }),
                newEntryList = state.entryList.concat();

            newEntryList[action.index] = updatedObject;
            return Object.assign({}, state, { entryList: newEntryList });
        case BOOK_QUEUED:
            var updatedObject = Object.assign({}, state.entryList[action.index], { queueing: false, queued: true, isbn: '' }),
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
            return Object.assign({}, state, { booksJustSaved: [{ ...action.book, success: true }].concat(state.booksJustSaved.slice(0, MAX_BOOKS_DISPLAYED)), pendingNumber: (state.pendingNumber - 1) || 0 });
        case BOOK_LOOKUP_FAILED:
            let entry = { _id: '' +new Date(), title: `Failed lookup for ${action.isbn}`, success: false };
            return Object.assign({}, state, { booksJustSaved: [entry].concat(state.booksJustSaved.slice(0, MAX_BOOKS_DISPLAYED)), pendingNumber: (state.pendingNumber - 1) || 0 });
    }
    return state;
}