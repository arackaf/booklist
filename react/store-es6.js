const rootReducer = require('./applicationRoot/rootReducer');
const thunkMiddleware = require('./redux-thunk');

function getNewReducer(reducerObj){
    if (!reducerObj) return Redux.combineReducers({ root: rootReducer });

    store.replaceReducer(Redux.combineReducers({
        [reducerObj.name]: reducerObj.reducer,
        root: rootReducer
    }));
}

const createStoreWithMiddleware = Redux.applyMiddleware(
    thunkMiddleware
)(Redux.createStore);

let store = createStoreWithMiddleware(getNewReducer());
window.store = store;

module.exports = {
    store,
    getNewReducer
};