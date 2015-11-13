const { UPDATE_ISBN, CURRENT_INPUT_FINISHED, GET_BOOK, GET_BOOK_RESULTS, BOOK_DELETED, BOOK_DELETING, SAVE_ALL_PENDING, GETTING_BOOKS } = require('../actions/bookActionNames');

const initialState = {
    activeInput: 0,
    entryList: Array.from({ length: 10 }).map(() => ({ isbn: '', fetched: false, fetching: false }))
};

function reducer(state = initialState, action = {}){
    //not very fluxy - but active input is only occasionally sent down - this allows an entry to focus as needed
    //focus isn't (as far as I can tell) bindable through the normal React pipeline, so I have to do this manually in
    //componentDidXXX, and so to avoid setting this precisely on every blur and focus, I just send it down when needed
    //ie, after the user hit enter, to move to the next input

    //PRE_FETCH check since this is fire back-to-back to CURRENT_INPUT_FINISHED and react seems to not re-render when with back-to-back updates,
    //so the new currentIndex is being swalled
    if (action.type !== GET_BOOK) {
        delete state.activeInput;
    }

    switch(action.type) {
        case UPDATE_ISBN:
            var objectToUpdate = Object.assign({}, action.entry, { isbn: action.isbn }),
                newEntryList = state.entryList.concat();

            newEntryList[newEntryList.indexOf(action.entry)] = objectToUpdate;
            return Object.assign({}, state, { entryList: newEntryList });
        case CURRENT_INPUT_FINISHED:
            if (action.index === state.entryList.length - 1) {
                //finish last item - highlight finished button
                return Object.assign({}, state, { activeInput: 'READY' });
            } else {
                return Object.assign({}, state, { activeInput: action.index + 1 });
            }
        case GET_BOOK:
            var updatedObject = Object.assign({}, state.entryList[action.index], { retrieving: true }),
                newEntryList = state.entryList.concat();

            newEntryList[action.index] = updatedObject;
            return Object.assign({}, state, { entryList: newEntryList });
        case GETTING_BOOKS:
            var newEntryList = state.entryList.concat();
            action.indexes.forEach(i => newEntryList[i].retrieving = true);

            return Object.assign({}, state, { entryList: newEntryList });
        case GET_BOOK_RESULTS:
            let searchResult = action.bookInfo;

            var updatedObject = Object.assign({}, state.entryList[action.index], { fetched: true, retrieving: false, retrieveFailure: searchResult.failure, fetchedTitle: searchResult.title, fetchedInfo: searchResult, fetchedIsbn: state.entryList[action.index].isbn }),
                newEntryList = state.entryList.concat();

            newEntryList[action.index] = updatedObject;
            return Object.assign({}, state, { entryList: newEntryList });
        case BOOK_DELETED:
            var newEntryList = state.entryList.concat();

            newEntryList[action.index] = { isbn: '', fetched: false, fetching: false };
            return Object.assign({}, state, { entryList: newEntryList });
        case BOOK_DELETING:
            var newEntryList = state.entryList.concat();

            newEntryList[action.index].deleting = true;
            return Object.assign({}, state, { entryList: newEntryList });
    }
    return state;
}

module.exports = reducer;