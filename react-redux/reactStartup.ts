import "./static/bootstrap/css/bootstrap-booklist-build.css";
import "./static/fontawesome/css/font-awesome-booklist-build.css";
import "simple-react-bootstrap/simple-react-bootstrap-styles.css";
import "@reach/dialog/styles.css";
import "./styles.css";

import "immutability-helper";

import { renderUI } from "applicationRoot/renderUI";
import { createElement } from "react";
import queryString from "query-string";
import getPublicUser from "graphQL/getPublicUser.graphql";

export type MutationType = { runMutation: any; dispatch: any; running: any };

import "util/ajaxUtil";

import createHistory from "history/createBrowserHistory";
import setupServiceWorker from "./util/setupServiceWorker";
import { isLoggedIn, graphqlClient } from "applicationRoot/rootReducer";

setupServiceWorker();

let currentModule;
let publicUserCache = {};

export const history = createHistory();

const validModules = new Set(["books", "scan", "home", "activate", "view", "subjects", "settings"]);
let initial = true;

history.listen(location => loadModule(location));
loadCurrentModule();

export function loadCurrentModule() {
  loadModule(history.location);
}

//TODO:
window.addEventListener("offline", () => store.dispatch({ type: IS_OFFLINE }));
window.addEventListener("online", () => store.dispatch({ type: IS_ONLINE }));

function loadModule(location) {
  let originalModule = location.pathname.replace(/\//g, "").toLowerCase();
  let module = originalModule || "home";
  let publicModule = module === "view" || module == "activate";

  let { logged_in, userId: currentUserId } = isLoggedIn();
  let loggedIn = logged_in && currentUserId;

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
    .then(([{ default: moduleObject }, publicUserInfo]: [any, any]) => {
      if (currentModule != module) return;

      store.dispatch(setModule(currentModule));

      if (publicUserInfo) {
        store.dispatch(setPublicInfo({ ...publicUserInfo, userId }));
      }
      renderUI(createElement(moduleObject.component));
    })
    .catch(() => {});
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
