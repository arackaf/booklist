const initialState = {
    entryList: [],
    activeInput: -1
};

function reducer(state = initialState, action = {}){
    //not very fluxy - but active input is only occasionally sent down - this allows an entry to focus as needed
    //focus isn't (as far as I can tell) bindable through the normal React pipeline, so I have to do this manually in
    //componentDidXXX, and so to avoid setting this precisely on every blur and focus, I just send it down when needed
    //ie, after the user hit enter, to move to the next input

    //PRE_FETCH check since this is fire back-to-back to CURRENT_INPUT_FINISHED and react seems to not re-render when with back-to-back updates,
    //so the new currentIndex is being swalled
    if (action.type !== 'PRE_FETCH') {
        delete state.activeInput;
    }

    switch(action.type) {
        case 'INITIALIZE_ENTRY_LIST':
            return Object.assign({}, state, {
                activeInput: 0,
                entryList: Array.from({length: action.count}).map(() => ({ isbn: '', fetched: false, fetching: false }))
            });
        case 'UPDATE_ISBN':
            var objectToUpdate = Object.assign({}, action.entry, { isbn: action.isbn }),
                newEntryList = state.entryList.concat();

            newEntryList[newEntryList.indexOf(action.entry)] = objectToUpdate;
            return Object.assign({}, state, { entryList: newEntryList });
        case 'CURRENT_INPUT_FINISHED':
            if (action.index === state.entryList.length - 1) {
                //finish last item - highlight finished button
                return Object.assign({}, state, { activeInput: 'READY' });
            } else {
                return Object.assign({}, state, { activeInput: action.index + 1 });
            }
        case 'PRE_FETCH':
            var updatedObject = Object.assign({}, state.entryList[action.index], { retrieving: true }),
                newEntryList = state.entryList.concat();

            newEntryList[action.index] = updatedObject;
            return Object.assign({}, state, { entryList: newEntryList });
        case 'FETCH_RESULTS':
            var updatedObject = Object.assign({}, state.entryList[action.index], { retrieving: false, fetchedTitle: action.bookInfo.title, fetchedInfo: action.bookInfo }),
                newEntryList = state.entryList.concat();

            newEntryList[action.index] = updatedObject;
            return Object.assign({}, state, { entryList: newEntryList });
    }
    return state;
}

let store = Redux.createStore(reducer);
window.store = store;

module.exports = store;