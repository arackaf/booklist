import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import throttle from 'lodash.throttle';

let asyncReducers = { };
export function getNewReducer(reducerObj?, initialState = {}) : any {
    if (!reducerObj) return combineLazyReducers({ app: rootReducer }, initialState);

    if (asyncReducers[`${reducerObj.name}Module`]) return; //registering an async reducer we already have - do nothing and get out

    asyncReducers[`${reducerObj.name}Module`] = reducerObj.reducer;

    store.replaceReducer(combineLazyReducers({
        app: rootReducer,
        ...asyncReducers
    }, store.getState()));

    if (reducerObj.initialize){
        store.dispatch(reducerObj.initialize({}));
    }
}

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore);


function combineLazyReducers(reducers, existingState){
    let handler = {
        ownKeys(target){
            return Array.from(new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(existingState)]));
        },
        get(target, key){
            return target[key] || (state => state === void 0 ? null : state); // <--- stub for Redux if not present
        },
        getOwnPropertyDescriptor(target, key){
            return Reflect.getOwnPropertyDescriptor(target, key) || Reflect.getOwnPropertyDescriptor(existingState, key);
        }
    };    
    return combineReducers(new Proxy(reducers, handler));
}

/*
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

let codeSplitReducerB = (state = {a: 3, b: 4}, action) => {
    switch(action.type){
        case 'B_INC_A': return {...state, a: state.a + 1}
        case 'B_INC_B': return {...state, b: state.b + 1}
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
    },
    codeSplitSliceB: {
        a: 9,
        b: 10
    }
};


let myStore = createStoreWithMiddleware(combineLazyReducers(initialReducer, initialState), initialState);
let state = myStore.getState();  // state.codeSplitSplice === {a: 12, b: 13} hooray!

let splitReducers : any = {
    codeSplitSlice: codeSplitReducer
}

myStore.replaceReducer(combineLazyReducers({
    app: rootReducer,
    ...splitReducers
}, myStore.getState()));

state = myStore.getState(); // state.codeSplitSplice === {a: 12, b: 13} still, as expected!

myStore.dispatch({type: 'INC_A'});
state = myStore.getState(); // state.codeSplitSplice === {a: 13, b: 13} as expected!
myStore.dispatch({type: 'INC_B'});
state = myStore.getState();  // state.codeSplitSplice === {a: 13, b: 14} as expected!

splitReducers.codeSplitSliceB = codeSplitReducerB;
myStore.replaceReducer(combineLazyReducers({
    app: rootReducer,
    ...splitReducers
}, myStore.getState()));

myStore.dispatch({type: 'B_INC_A'});
state = myStore.getState(); 

myStore.dispatch({type: 'B_INC_B'});
state = myStore.getState(); 

debugger;
*/

let initialState = void 0;
if (localStorage){
    try {
        initialState = JSON.parse(localStorage.getItem('reduxState'));
        console.log('initial state', initialState)
    }catch (err){
        console.log('Error parsing state', err);
    }
}

export const store = createStoreWithMiddleware(getNewReducer(null, initialState), initialState);

if (localStorage){
    function saveState(){
        try {
            //localStorage.setItem('reduxState', JSON.stringify(store.getState()));
        } catch(err){
            console.log('Error parsing and saving state', err);
        }
    }
    store.subscribe(throttle(saveState, 1000));
}