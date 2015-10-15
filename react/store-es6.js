function reducer(state = { from: 'Adam' }, action = {}){
    if (action.type == 'SET_FROM'){
        return Object.assign({}, state, { from: action.from });
    }
    return state;
}

let store = Redux.createStore(reducer);
window.store = store;

module.exports = store;