const Provider = ReactRedux.Provider;
const Header = require('./rootComponents/Header');
const { store } = require('/react-redux/applicationRoot/store');

function clearUI(){
    ReactDOM.render(
        <div></div>,
        document.getElementById('home')
    );
}

function renderUI(component){
    ReactDOM.render(
        <Provider store={store}>
            <div>
                { component }
            </div>
        </Provider>,
        document.getElementById('home')
    );
}

module.exports = { renderUI, clearUI };