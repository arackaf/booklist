import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers } from 'redux';

let asyncReducers = { };
export function getNewReducer(reducerObj){
    if (!reducerObj) return combineReducers({ root: rootReducer });

    if (asyncReducers[reducerObj.name]) return; //registering an async reducer we already have - do nothing and get out

    asyncReducers[`${reducerObj.name}Module`] = reducerObj.reducer;

    store.replaceReducer(combineReducers({
        root: rootReducer,
        ...asyncReducers
    }));
}

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore);

export const store = createStoreWithMiddleware(getNewReducer());