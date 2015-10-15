const initialState = {
    entryList: []
};

function reducer(state = initialState, action = {}){
    if (action.type == 'INITIALIZE_ENTRY_LIST'){
        return Object.assign({}, state, { entryList: Array.from({ length: action.count }).map(() => ({ isbn: '', fetched: false, fetching: false })) });
    } else if (action.type === 'UPDATE_ISBN'){
        let objectToUpdate = Object.assign({}, action.entry, { isbn: action.isbn }),
            newEntryList = state.entryList.concat();

        newEntryList[newEntryList.indexOf(action.entry)] = objectToUpdate;
        return Object.assign({}, state, { entryList: newEntryList });
    }

    return state;
}

let store = Redux.createStore(reducer);
window.store = store;

module.exports = store;