
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
        originalModule = hash.split('/')[0] || '',
        module = hash.split('/')[0] || 'books';

    let loggedIn = isLoggedIn();
    if (!loggedIn){
        if (originalModule && module != 'home'){
            return forceLogin();
        } else {
            module = 'home';
        }
    }

    if (module === 'home') return goHome();

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

function goHome(){
    currentModule = null;
    System.import('./modules/home/home').then(home => {
        clearUI();
        renderUI(React.createElement(home));
    });
}

function isLoggedIn(){
    return /logged_in/ig.test(document.cookie);
}

export default {
    loadCurrentModule,
    forceLogin,
    get isLoggedIn(){ return isLoggedIn(); }
}