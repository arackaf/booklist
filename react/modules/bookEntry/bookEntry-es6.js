let { initialize } = require('./actions/bookActionCreators');

let Provider = ReactRedux.Provider,
    BookEntryList = require('./components/bookEntryList');

let store = require('/react/store');
let reducer = require('./reducers/bookEntryReducer');

store.replaceReducer(reducer);
store.dispatch(initialize());

function projectState(state){
    return state;
}

BookEntryList = ReactRedux.connect(projectState)(BookEntryList);

ReactDOM.render(
    <Provider store={store}>
        <BookEntryList count="10" />
    </Provider>,
    document.getElementById('home')
);