import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers } from 'redux';

let asyncReducers = { };
export function getNewReducer(reducerObj){
    if (!reducerObj) return combineReducers({ app: rootReducer });

    if (asyncReducers[reducerObj.name]) return; //registering an async reducer we already have - do nothing and get out

    asyncReducers[`${reducerObj.name}Module`] = reducerObj.reducer;

    store.replaceReducer(combineReducers({
        app: rootReducer,
        ...asyncReducers
    }));

    if (reducerObj.initialize){
        store.dispatch(reducerObj.initialize({}));
    }
}

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore);

export const store = createStoreWithMiddleware(getNewReducer());