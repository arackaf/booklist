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

let initialReducer = {
    app: rootReducer
};

let initialState = { // <----- from local storage 
    codeSplitSlice: { // <----- from code-split reducers
        a: 12,
        b: 13
    }
};

let handler = {
    ownKeys(target){
        return Array.from(new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(initialState)]));
    },
    get(target, key){
        return target[key] || (state => state === void 0 ? null : state); // <--- stub for Redux if not present
    },
    getOwnPropertyDescriptor(target, key){
        return Reflect.getOwnPropertyDescriptor(target, key) || Reflect.getOwnPropertyDescriptor(initialState, key);
    }
};

let reducerProxy = new Proxy(initialReducer, handler);
let myStore = createStoreWithMiddleware(combineReducers(reducerProxy), initialState);

let state = myStore.getState();
// state.codeSplitSplice === {a: 12, b: 13} hooray!


myStore.replaceReducer(combineReducers({
    app: rootReducer,
    codeSplitSlice: codeSplitReducer
}));

state = myStore.getState();
// state.codeSplitSplice === {a: 12, b: 13} still, as expected!

myStore.dispatch({type: 'INC_A'});
state = myStore.getState();
// state.codeSplitSplice === {a: 13, b: 13} as expected!

myStore.dispatch({type: 'INC_B'});
state = myStore.getState();
// state.codeSplitSplice === {a: 13, b: 14} as expected!

debugger;

export const store = createStoreWithMiddleware(getNewReducer());