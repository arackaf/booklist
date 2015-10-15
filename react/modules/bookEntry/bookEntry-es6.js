let Provider = ReactRedux.Provider,
    BookEntryList = require('./components/bookEntryList');

let store = require('/react/store');

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