import HashUtility, { SerializedHash } from 'util/hashManager';
import { renderUI, clearUI } from 'applicationRoot/renderUI';
import { store, getNewReducer } from 'applicationRoot/store';
import { createElement } from 'react';

import 'util/ajaxUtil';

let currentModule;
let publicUserCache = {};

window.onhashchange = function () {
    loadCurrentModule();
};

const validModules = new Set(['books', 'scan', 'home', 'activate', 'view']);

export const globalHashManager = new HashUtility();

loadCurrentModule();
export function loadCurrentModule() {
    let hash = window.location.hash.replace('#', ''),
        originalModule = hash.split('/')[0] || '',
        module = (hash.split('/')[0] || 'home').toLowerCase(),
        publicModule = module === 'view';

    let loggedIn = isLoggedIn();

    if (!loggedIn && !publicModule){
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

    if (publicModule){
        var userId = globalHashManager.currentParameters.userId;
        var publicUserPromise = userId ? (publicUserCache[userId] || (publicUserCache[userId] = fetchPublicUserInfo(userId))) : null;

        if (module === 'view') {
            module = 'books';
        }
    }
    if (module === currentModule) return;
    currentModule = module;

    Promise.all([
        System.import(`./modules/${module}/${module}`),
        publicUserPromise
    ]).then(([{ default: module }, publicUserInfo]) => {
        if (publicUserInfo){
            store.dispatch({ type: 'SET_PUBLIC_INFO', name: publicUserInfo.name, booksHeader: publicUserInfo.booksHeader, _id: userId });
        }

        clearUI();
        if (module.reducer) {
            getNewReducer({name: module.name, reducer: module.reducer});
        }
        renderUI(createElement(module.component));
    });
}

export function isLoggedIn(){
    return /logged_in/ig.test(document.cookie);
}

export function goHome(){
    let currentModule = globalHashManager.getCurrentHashInfo().module || 'home';
    if (currentModule === 'home') return;
    globalHashManager.setHash(new SerializedHash('home'));
}

function fetchPublicUserInfo(userId){
    return new Promise((res, rej) => {
        ajaxUtil.post('/user/getPubliclyAvailableUsersName', { _id: userId }, resp => {
            res({ name: resp.name, booksHeader: resp.booksHeader  })
        })
    });
}