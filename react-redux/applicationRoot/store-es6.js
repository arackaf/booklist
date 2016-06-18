import rootReducer from './rootReducer';
import thunkMiddleware from './../util/redux-thunk';

export function getNewReducer(reducerObj){
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

export const store = createStoreWithMiddleware(getNewReducer());