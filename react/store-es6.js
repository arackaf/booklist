const initialState = {
    entryList: [],
    activeInput: -1
};

function reducer(state = initialState, action = {}){
    //not very fluxy - but active input is only occasionally sent down - this allows an entry to focus as needed
    //focus isn't (as far as I can tell) bindable through the normal React pipeline, so I have to do this manually in
    //componentDidXXX, and so to avoid setting this precisely on every blur and focus, I just send it down when needed
    //ie, after the user hit enter, to move to the next input
    delete state.activeInput;

    switch(action.type) {
        case 'INITIALIZE_ENTRY_LIST':
            return Object.assign({}, state, {
                activeInput: 0,
                entryList: Array.from({length: action.count}).map(() => ({isbn: '', fetched: false, fetching: false}))
            });
        case 'UPDATE_ISBN':
            let objectToUpdate = Object.assign({}, action.entry, {isbn: action.isbn}),
                newEntryList = state.entryList.concat();

            newEntryList[newEntryList.indexOf(action.entry)] = objectToUpdate;
            return Object.assign({}, state, { entryList: newEntryList });
        case 'CURRENT_INPUT_FINISHED':
            let currentEntryIndex = state.entryList.indexOf(action.entry);

            if (currentEntryIndex === state.entryList.length - 1) {
                //finish last item - highlight finished button
                return Object.assign({}, state, { activeInput: 'READY' });
            } else {
                return Object.assign({}, state, { activeInput: currentEntryIndex + 1 });
            }
    }
    return state;
}

let store = Redux.createStore(reducer);
window.store = store;

module.exports = store;