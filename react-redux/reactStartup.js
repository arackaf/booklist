import { renderUI, clearUI } from 'applicationRoot/renderUI';
import { store, getNewReducer } from 'applicationRoot/store';
import { createElement } from 'react';

import {setDesktop, setMobile, setModule, setLoggedIn, setPublicInfo, setRequestDesktop, setIsTouch} from './applicationRoot/rootReducerActionCreators';
import 'util/ajaxUtil';

import createHistory from 'history/createBrowserHistory'

if ('ontouchstart' in window || 'onmsgesturechange' in window){
    store.dispatch(setIsTouch(true));
}

try {
    var desktopRequested = !!localStorage.getItem('useDesktop');
} catch(x){ }

if (window.screen.width < 700) {
    store.dispatch(setMobile());
} else {
    store.dispatch(setDesktop());
}

if (desktopRequested){
    store.dispatch(setRequestDesktop());
}

let currentModule;
let currentModuleObject;
let publicUserCache = {};

const history = createHistory()
export {history};
const location = history.location;

export function getCurrentHistoryState(){
    let keyOrder = [];
    let searchState = history.location.search.replace(/^\?/, '').split('&').filter(s => s).reduce((hash, s) => {
        let pieces = s.split('=');
        keyOrder.push(pieces[0]);
        return (hash[pieces[0]] = pieces[1], hash);
    }, {});

    return {
        pathname: location.pathname,
        __keyOrder: keyOrder,
        searchState
    };
}

const validModules = new Set(['books', 'scan', 'home', 'activate', 'view', 'subjects', 'settings']);

const unlisten = history.listen((location, action) => {
  // location is an object like window.location 
  loadCurrentModule(location);
});
loadCurrentModule(history.location);

let initial = true;

export function loadCurrentModule(location) {
    let originalModule = location.pathname.replace(/\//g, '').toLowerCase(),
        module = originalModule || 'home',
        publicModule = module === 'view' || module == 'activate';

    let {logged_in, userId: currentUserId} = isLoggedIn(),
        loggedIn = logged_in && currentUserId;

    if (!loggedIn && !publicModule){
        if (originalModule && module != 'home'){
            module = 'authenticate';
        } else {
            module = 'home';
        }
    } else {
        if (!validModules.has(module)){
            history.push('/books');
            return;
        }
    }

    if (loggedIn){
        store.dispatch(setLoggedIn(currentUserId));
    }

    if (publicModule){
        var userId = getCurrentHistoryState().searchState.userId;

        //switching to a new public viewing - reload page
        if (!initial && store.getState().app.publicUserId != userId){
            location.reload();
            return;
        }

        var publicUserPromise = userId ? (publicUserCache[userId] || (publicUserCache[userId] = fetchPublicUserInfo(userId))) : null;

        if (module === 'view') {
            module = 'books';
        }
    } else if (store.getState().app.publicUserId){
        //leaving public viewing - reload page
        location.reload();
        return;
    }

    initial = false;

    if (module === currentModule) {
        return;
    }
    currentModule = module;

    let modulePromise = (() => {
        switch(module.toLowerCase()){
            case 'activate': return (System.import('./modules/activate/activate'));
            case 'authenticate': return (System.import('./modules/authenticate/authenticate'));
            case 'books': return (System.import('./modules/books/books'));
            case 'home': return (System.import('./modules/home/home'));
            case 'scan': return (System.import('./modules/scan/scan'));
            case 'subjects': return (System.import('./modules/subjects/subjects'));
            case 'settings': return (System.import('./modules/settings/settings'));
        }
    })();

    Promise.all([
        modulePromise,
        publicUserPromise
    ]).then(([{ default: moduleObject }, publicUserInfo]) => {
        if (currentModule != module) return;
        
        currentModuleObject = moduleObject;
        store.dispatch(setModule(currentModule));

        if (publicUserInfo){
            store.dispatch(setPublicInfo({...publicUserInfo, userId}));
        }

        if (moduleObject.reducer) {
            getNewReducer({name: moduleObject.name, reducer: moduleObject.reducer});
        }
        renderUI(createElement(moduleObject.component));
        if (moduleObject.initialize) {
            store.dispatch(moduleObject.initialize({}));
        }
    });
}

export function isLoggedIn(){
    let logged_in = getCookie('logged_in'),
        userId = getCookie('userId');
    return {logged_in, userId};
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}

export function goto(module, search){
    if (currentModule !== module) {
        history.push({pathname: `/${module}`, search: search || undefined});
    }
}

export function setSearchValues(...args){
    let {pathname, __keyOrder, searchState} = getCurrentHistoryState();

    let orderedKeys = args.filter((_, i) => !(i % 2));
    for (let i = 0; i < args.length - 1; i+= 2){
        if (!searchState.hasOwnProperty(args[i])){
            __keyOrder.push(args[i]);
        }
        searchState[args[i]] = args[i+1];
    }
    history.push({
        pathname: history.location.pathname, 
        search: orderedKeys.filter(k => searchState[k]).map(k => `${k}=${searchState[k]}`).join('&')
    });
}

function fetchPublicUserInfo(userId){
    return new Promise((res, rej) => {
        ajaxUtil.post('/user/getPubliclyAvailableUsersName', { _id: userId }, resp => {
            res({...resp})
        })
    });
}