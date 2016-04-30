
const { renderUI, clearUI } = require('application-root/renderUI');
const { store, getNewReducer } = require('application-root/store');

require('react-redux-util/ajaxUtil');

let currentModule;

window.onhashchange = function () {
    loadCurrentModule();
};

loadCurrentModule();

function loadCurrentModule() {
    let hash = window.location.hash.replace('#', ''),
        module = hash.split('/')[0] || 'books';

    let loggedIn = /logged_in/ig.test(document.cookie);
    if (!loggedIn){
        forceLogin();
        return;
    }

    if (module === currentModule) return;
    currentModule = module;

    System.import(`./modules/${module}/${module}`).then(module => {
        clearUI();
        getNewReducer({ name: module.name, reducer: module.reducer });
        renderUI(module.component);
    });
}

function forceLogin(){
    currentModule = null;
    System.import('./modules/authenticate/loginScreen').then(login => {
        clearUI();
        renderUI(React.createElement(login));
    });
}

export default { loadCurrentModule, forceLogin }