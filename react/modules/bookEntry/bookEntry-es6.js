let Provider = ReactRedux.Provider,
    BookEntryList = require('./components/bookEntryList'),
    Header = require('../../applicationRoot/rootComponents/Header');

let { store, getNewReducer } = require('/react/store');
let reducer = require('./reducers/bookEntryReducer');

getNewReducer({ name: 'bookEntry', reducer });

function projectState(state){
    return state.bookEntry;
}

BookEntryList = ReactRedux.connect(projectState)(BookEntryList);

ReactDOM.render(
    <Provider store={store}>
        <div>
            <Header />
            <br /><br />
            <BookEntryList count="10" />
        </div>
    </Provider>,
    document.getElementById('home')
);