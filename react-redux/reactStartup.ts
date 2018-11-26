import { renderUI, clearUI } from "applicationRoot/renderUI";
import { store, getNewReducer } from "applicationRoot/store";
import { createElement } from "react";
import queryString from "query-string";
import getPublicUser from "graphQL/getPublicUser.graphql";

import "immutability-helper";

import { Client, setDefaultClient, compress } from "micro-graphql-react";

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

declare var window: any;

(function() {
  if ("serviceWorker" in navigator) {
    //  && !/localhost/.test(window.location as any)) {
    navigator.serviceWorker.register("/service-worker.js").then(registration => {
      if (registration.waiting && registration.active) {
        newerSwAvailable(registration.waiting);
      }
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              newerSwAvailable(installingWorker);
            }
          }
        };
      };

      if (isLoggedIn().logged_in) {
        try {
          navigator.serviceWorker.controller.postMessage({ command: "do-sync" });
        } catch (er) {}
      }
    });

    function newerSwAvailable(sw) {
      try {
        navigator.serviceWorker.addEventListener("message", event => {
          if (event.data == "sw-updated") {
            location.reload();
          }
        });
        import("toastify-js").then(({ default: Toastify }) => {
          window.addEventListener("click", evt => {
            try {
              if (evt.target.classList.contains("do-sw-update")) {
                sw.postMessage("sw-update-accepted");
              }
            } catch (e) {}
          });
          Toastify({
            text: `
              <h4 style='display: inline'>An update is available!</h4>
              <br><br>
              <a class='do-sw-update' style='color: white'>Click to update and reload</a>&nbsp;&nbsp;
            `.trim(),
            duration: 7000,
            gravity: "bottom",
            close: true
          }).showToast();
        });
      } catch (er) {}
    }

    // if (Notification) {
    //   Notification.requestPermission().then(permission => {});
    // }

    if (isLoggedIn()) {
      // let subscriptionOptions = {
      //   userVisibleOnly: true,
      //   applicationServerKey: urlBase64ToUint8Array("BCC0wqyL-OGz5duRO9-kOSUEv72BMGf0x0oaMGryF1eLa3FF-sW2YmunhNqQegrXHykP-Wa6xC1rEnDuBGtjgUo")
      // };
      // navigator.serviceWorker.ready.then(registration => {
      //   registration.pushManager.subscribe(subscriptionOptions).then(subscription => {
      //     ajaxUtil.post("/user/saveNotificationSubscription", { subscription: JSON.stringify(subscription) });
      //   });
      // });
      /*
      
        async saveNotificationSubscription({ subscription }) {
          let userId = this.request.user.id;
          await new UserDAO().updateSubscription(userId, JSON.parse(subscription));
          this.send({ success: true });
        }
      
      */
    }
  }
})();

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendNotification(text) {
  if ((Notification as any).permission == "granted") {
    new Notification(text);
  }
}

//sendNotification("Hi there");

declare global {
  interface System {
    import(request: string): Promise<any>;
  }
  var System: System;
}

if ("ontouchstart" in window || "onmsgesturechange" in window) {
  store.dispatch(setIsTouch(true));
}

try {
  var desktopRequested = !!localStorage.getItem("useDesktop");
} catch (x) {}

if (window.screen.width < 700) {
  store.dispatch(setMobile());
} else {
  store.dispatch(setDesktop());
}

if (desktopRequested) {
  store.dispatch(setRequestDesktop());
}

let currentModule;
let publicUserCache = {};

if (isLoggedIn().logged_in) {
  store.dispatch(loadTags());
  store.dispatch(loadSubjects());
}

const history = createHistory();
export { history };

const validModules = new Set(["books", "scan", "home", "activate", "view", "subjects", "settings"]);
let initial = true;
const unlisten = history.listen((location, action) => {
  // location is an object like window.location
  loadModule(location);
});
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
