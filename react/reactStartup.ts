import "./static/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./site-styles.scss";

import { renderUI } from "app/renderUI";
import { lazy } from "react";

import { history } from "util/urlHelpers";
import booksPreload from "./modules/books/booksPreload";

export type MutationType = { runMutation: any; dispatch: any; running: any };

import "util/ajaxUtil";

import setupServiceWorker from "./util/setupServiceWorker";
import { isLoggedIn, isAdmin } from "util/loginStatus";
import { AppState } from "app/appState";
import { getCurrentHistoryState } from "util/urlHelpers";

setupServiceWorker();

let currentModule;

const ActivateComponent = lazy(() => import(/* webpackChunkName: "small-modules" */ "./modules/activate/activate"));
const AuthenticateComponent = lazy(() => import(/* webpackChunkName: "small-modules" */ "./modules/authenticate/authenticate"));
const BooksComponent = lazy(() => import(/* webpackChunkName: "books-module" */ "./modules/books/books"));
const HomeComponent = lazy(() => import(/* webpackChunkName: "home-module" */ "./modules/home/home"));
const ScanComponent = lazy(() => import(/* webpackChunkName: "scan-module" */ "./modules/scan/scan"));
const SubjectsComponent = lazy(() => import(/* webpackChunkName: "subject-module" */ "./modules/subjects/subjects"));
const StyleDemoComponent = lazy(() => import(/* webpackChunkName: "admin-modules" */ "./modules/styledemo/styledemo"));
const SettingsComponent = lazy(() => import(/* webpackChunkName: "small-modules" */ "./modules/settings/settings"));
const AdminComponent = lazy(() => import(/* webpackChunkName: "admin-modules" */ "./modules/admin/admin"));
const JrComponent = lazy(() => import(/* webpackChunkName: "admin-modules" */ "./modules/jr/songEdit"));

const getModuleComponent = moduleToLoad => {
  let adminUser = isAdmin();
  if (moduleToLoad == "admin" && !adminUser) {
    return HomeComponent;
  }
  switch (moduleToLoad.toLowerCase()) {
    case "activate":
      return ActivateComponent;
    case "authenticate":
      return AuthenticateComponent;
    case "books":
    case "view":
      booksPreload();
      return BooksComponent;
    case "home":
      return HomeComponent;
    case "scan":
      return ScanComponent;
    case "subjects":
      return SubjectsComponent;
    case "styledemo":
      return StyleDemoComponent;
    case "settings":
      return SettingsComponent;
    case "admin":
      return AdminComponent;
    case "jr":
      return JrComponent;
  }

  return HomeComponent;
};

renderUI();

export function loadCurrentModule(app: AppState, { setModule, setPublicId }) {
  let location = history.location;
  let originalModule = location.pathname.replace(/\//g, "").toLowerCase();
  let { logged_in, userId: currentUserId } = isLoggedIn();
  let moduleToLoad = originalModule || (logged_in ? "books" : "home");
  let publicModule = moduleToLoad == "home" || moduleToLoad == "view" || moduleToLoad == "activate" || moduleToLoad == "settings";

  let loggedIn = logged_in && currentUserId;
  let userId = getCurrentHistoryState().searchState.userId;

  if (!loggedIn && !publicModule) {
    moduleToLoad = "authenticate";
  }

  //changing public viewing status - reload page
  if (app.publicUserId != userId) {
    window.location.reload();
    return;
  }

  if (moduleToLoad !== currentModule) {
    currentModule = moduleToLoad;

    if (currentModule != moduleToLoad) return;
    setModule(currentModule);
    renderUI(getModuleComponent(moduleToLoad));
  }
}

export function goto(module) {
  var userId = getCurrentHistoryState().searchState.userId;

  if (currentModule !== module) {
    history.push({ pathname: `/${module}`, search: userId ? `userId=${userId}` : void 0 });
  }
}
