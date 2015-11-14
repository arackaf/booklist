const Provider = ReactRedux.Provider;
const Header = require('./rootComponents/Header');
const { store } = require('/react-redux/applicationRoot/store');

function renderUI(component){
    ReactDOM.render(
        <Provider store={store}>
            <div>
                <Header />
                <br /><br />
                { component }
            </div>
        </Provider>,
        document.getElementById('home')
    );
}

module.exports = renderUI;