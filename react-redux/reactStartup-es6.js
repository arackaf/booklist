import HashUtility, { SerializedHash } from 'react-redux-util/hashManager';
const { renderUI, clearUI } = require('application-root/renderUI');
const { store, getNewReducer } = require('application-root/store');

require('react-redux-util/ajaxUtil');

let currentModule;

window.onhashchange = function () {
    loadCurrentModule();
};

const validModules = new Set(['books', 'scan', 'home']);

loadCurrentModule();
export function loadCurrentModule() {
    let hash = window.location.hash.replace('#', ''),
        originalModule = hash.split('/')[0] || '',
        module = (hash.split('/')[0] || 'home').toLowerCase();

    let loggedIn = isLoggedIn();
    if (!loggedIn){
        if (originalModule && module != 'home'){
            module = 'authenticate';
        } else {
            module = 'home';
        }
    } else {
        if (!validModules.has(module)){
            window.location.hash = 'books';
            return;
        }
    }

    if (module === currentModule) return;
    currentModule = module;

    System.import(`./modules/${module}/${module}`).then(module => {
        clearUI();
        if (module.reducer) {
            getNewReducer({name: module.name, reducer: module.reducer});
        }
        renderUI(React.createElement(module.component));
    });
}

export const globalHashManager = new HashUtility();

export function isLoggedIn(){
    return /logged_in/ig.test(document.cookie);
}

export function goHome(){
    let currentModule = globalHashManager.getCurrentHashInfo().module || 'home';
    if (currentModule === 'home') return;
    globalHashManager.setHash(new SerializedHash('home'));
}