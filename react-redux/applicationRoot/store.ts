import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers } from 'redux';

let asyncReducers = { };
export function getNewReducer(reducerObj?) : any {
    if (!reducerObj) return combineReducers({ app: rootReducer });

    if (asyncReducers[`${reducerObj.name}Module`]) return; //registering an async reducer we already have - do nothing and get out

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

const aInit = {
    a: 0,
    b: 1
}

let codeSplitReducer = (state = aInit, action) => {
    switch(action.type){
        case 'INC_A': return {...state, a: state.a + 1}
        case 'INC_B': return {...state, b: state.b + 1}
    }
    return state;
}

let myStore = createStoreWithMiddleware(combineReducers({
    app: rootReducer,
    codeSplitSlice: state => state || null
}), {
    codeSplitSlice: {
        a: 12,
        b: 13
    }
})

//later

myStore.replaceReducer(combineReducers({
    app: rootReducer,
    codeSplitSlice: codeSplitReducer
}));

myStore.dispatch({type: 'INC_A'});
myStore.dispatch({type: 'INC_B'});



export const store = createStoreWithMiddleware(getNewReducer());