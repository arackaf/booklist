import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers } from 'redux';

export function getNewReducer(reducerObj){
    if (!reducerObj) return combineReducers({ root: rootReducer });

    store.replaceReducer(function(){
        return {
            root: rootReducer()
        }
    });

    store.replaceReducer(combineReducers({
        [reducerObj.name]: reducerObj.reducer,
        root: rootReducer
    }));
}

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore);

export const store = createStoreWithMiddleware(getNewReducer());