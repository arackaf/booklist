const initialState = {
    entryList: [],
    activeInput: -1
};

const thunkMiddleware = require('./redux-thunk');

function rootReducer(state = {}){
    return state;
}

const createStoreWithMiddleware = Redux.applyMiddleware(
    thunkMiddleware
)(Redux.createStore);

let store = createStoreWithMiddleware(rootReducer);
window.store = store;

module.exports = store;