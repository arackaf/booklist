import { renderUI, clearUI } from "applicationRoot/renderUI";
import { store, getNewReducer } from "applicationRoot/store";
import { createElement } from "react";
import queryString from "query-string";
import getPublicUser from "graphQL/getPublicUser.graphql";

import "immutability-helper";

import { Client, setDefaultClient } from "micro-graphql-react";

const graphqlClient = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" }
});

setDefaultClient(graphqlClient);

export type MutationType = { runMutation: any; dispatch: any; running: any };

import {
  setDesktop,
  setMobile,
  setModule,
  setLoggedIn,
  setPublicInfo,
  setRequestDesktop,
  setIsTouch,
  loadSubjects
} from "./applicationRoot/rootReducerActionCreators";
import "util/ajaxUtil";

import createHistory from "history/createBrowserHistory";
import { loadTags } from "applicationRoot/tags/actionCreators";
import setupServiceWorker from "./util/setupServiceWorker";

setupServiceWorker();

if ("ontouchstart" in window || "onmsgesturechange" in window) {
  store.dispatch(setIsTouch(true));
}

if (window.screen.width < 700) {
  store.dispatch(setMobile());
} else {
  store.dispatch(setDesktop());
}

if (!!localStorage.getItem("useDesktop")) {
  store.dispatch(setRequestDesktop());
}

let currentModule;
let publicUserCache = {};

if (isLoggedIn().logged_in) {
  store.dispatch(loadTags());
  store.dispatch(loadSubjects());
}

export const history = createHistory();

const validModules = new Set(["books", "scan", "home", "activate", "view", "subjects", "settings"]);
let initial = true;

history.listen(location => loadModule(location));
loadCurrentModule();

export function loadCurrentModule() {
  loadModule(history.location);
}

function loadModule(location) {
  let originalModule = location.pathname.replace(/\//g, "").toLowerCase(),
    module = originalModule || "home",
    publicModule = module === "view" || module == "activate";

  let { logged_in, userId: currentUserId } = isLoggedIn(),
    loggedIn = logged_in && currentUserId;

  if (!loggedIn && !publicModule) {
    if (originalModule && module != "home") {
      module = "authenticate";
    } else {
      module = "home";
    }
  } else {
    if (!validModules.has(module)) {
      history.push("/books");
      return;
    }
  }

  if (loggedIn) {
    store.dispatch(setLoggedIn(currentUserId));
  }

  if (publicModule) {
    var userId = getCurrentHistoryState().searchState.userId;

    //switching to a new public viewing - reload page
    if (!initial && (store.getState() as any).app.publicUserId != userId) {
      window.location.reload();
      return;
    }

    var publicUserPromise = userId ? publicUserCache[userId] || (publicUserCache[userId] = fetchPublicUserInfo(userId)) : null;

    if (module === "view") {
      module = "books";
    }
  } else if ((store.getState() as any).app.publicUserId) {
    //leaving public viewing - reload page
    window.location.reload();
    return;
  }

  initial = false;

  if (module === currentModule) {
    return;
  }
  currentModule = module;

  let modulePromise = (() => {
    switch (module.toLowerCase()) {
      case "activate":
        return import(/* webpackChunkName: "small-modules" */ "./modules/activate/activate");
      case "authenticate":
        return import(/* webpackChunkName: "small-modules" */ "./modules/authenticate/authenticate");
      case "books":
        return import(/* webpackChunkName: "books-module" */ "./modules/books/books");
      case "home":
        return import(/* webpackChunkName: "home-module" */ "./modules/home/home");
      case "scan":
        return import(/* webpackChunkName: "scan-module" */ "./modules/scan/scan");
      case "subjects":
        return import(/* webpackChunkName: "subject-module" */ "./modules/subjects/subjects");
      case "settings":
        return import(/* webpackChunkName: "small-modules" */ "./modules/settings/settings");
    }
  })();

  Promise.all([modulePromise, publicUserPromise])
    .then(([{ default: moduleObject }, publicUserInfo]) => {
      if (currentModule != module) return;

      let priorState = store.getState();
      store.dispatch(setModule(currentModule));

      if (publicUserInfo) {
        store.dispatch(setPublicInfo({ ...publicUserInfo, userId }));
        store.dispatch(loadTags());
        store.dispatch(loadSubjects());
      }

      if (moduleObject.reducer) {
        getNewReducer({ name: module, reducer: moduleObject.reducer, initialize: moduleObject.initialize, priorState });
      }
      renderUI(createElement(moduleObject.component));
    })
    .catch(() => {});
}

export function isLoggedIn() {
  let logged_in = getCookie("logged_in"),
    userId = getCookie("userId");
  return { logged_in, userId };
}

function getCookie(name) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

export function goto(module, search?) {
  if (currentModule !== module) {
    history.push({ pathname: `/${module}`, search: search || undefined });
  }
}

export function getCurrentHistoryState() {
  let location = history.location;
  return {
    pathname: location.pathname,
    searchState: queryString.parse(location.search)
  };
}

export function setSearchValues(state) {
  let { pathname, searchState: existingSearchState } = getCurrentHistoryState();
  let newState = { ...existingSearchState, ...state };
  newState = Object.keys(newState)
    .filter(k => newState[k])
    .reduce((hash, prop) => ((hash[prop] = newState[prop]), hash), {});

  history.push({
    pathname: history.location.pathname,
    search: queryString.stringify(newState)
  });
}

function fetchPublicUserInfo(userId) {
  return new Promise((res, rej) => {
    graphqlClient.runQuery(getPublicUser, { _id: userId, cache: 5 }).then(resp => {
      let publicUser = resp.data && resp.data.getPublicUser && resp.data.getPublicUser.PublicUser;
      publicUser ? res(publicUser) : rej();
    });
  });
}
