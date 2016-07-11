import HashUtility, { SerializedHash } from 'util/hashManager';
import { renderUI, clearUI } from 'applicationRoot/renderUI';
import { store, getNewReducer } from 'applicationRoot/store';
import { createElement } from 'react';

import 'util/ajaxUtil';

let currentModule;

window.onhashchange = function () {
    loadCurrentModule();
};

const validModules = new Set(['books', 'scan', 'home', 'activate', 'view']);

loadCurrentModule();
export function loadCurrentModule() {
    let hash = window.location.hash.replace('#', ''),
        originalModule = hash.split('/')[0] || '',
        module = (hash.split('/')[0] || 'home').toLowerCase();

    if (module === 'view' && !/userId=.+/.test(hash)){
        location.hash = 'books';
        return;
    }

    let loggedIn = isLoggedIn(),
        loginOverride = module === 'view' && /userId=.+/.test(hash);

    if (!loggedIn && !loginOverride){
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

    if (loginOverride){
        module = 'books';
    }
    if (module === currentModule) return;
    currentModule = module;

    System.import(`./modules/${module}/${module}`).then(({ default: module }) => {
        clearUI();
        if (module.reducer) {
            getNewReducer({name: module.name, reducer: module.reducer});
        }
        renderUI(createElement(module.component));
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