const Provider = ReactRedux.Provider;
const Header = require('./rootComponents/Header');

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