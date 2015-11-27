const rootReducer = require('./rootReducer');
const thunkMiddleware = require('./../util/redux-thunk');

function getNewReducer(reducerObj){
    if (!reducerObj) return Redux.combineReducers({ root: rootReducer });

    store.replaceReducer(function(){
        return {
            root: rootReducer()
        }
    });

    store.replaceReducer(Redux.combineReducers({
        [reducerObj.name]: reducerObj.reducer,
        root: rootReducer
    }));
}

const createStoreWithMiddleware = Redux.applyMiddleware(
    thunkMiddleware
)(Redux.createStore);

const store = createStoreWithMiddleware(getNewReducer());

module.exports = {
    store,
    getNewReducer
};