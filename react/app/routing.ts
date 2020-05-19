import {lazy} from "react";

import booksPreload from "../modules/books/booksPreload";
import subjectsPreload from "../modules/subjects/subjectsPreload";

import { isAdmin } from "util/loginStatus";

const ActivateComponent = lazy(() => import(/* webpackChunkName: "small-modules" */ "../modules/activate/activate"));
const AuthenticateComponent = lazy(() => import(/* webpackChunkName: "small-modules" */ "../modules/authenticate/authenticate"));
const BooksComponent = lazy(() => import(/* webpackChunkName: "books-module" */ "../modules/books/books"));
const HomeComponent = lazy(() => import(/* webpackChunkName: "home-module" */ "../modules/home/home"));
const ScanComponent = lazy(() => import(/* webpackChunkName: "scan-module" */ "../modules/scan/scan"));
const SubjectsComponent = lazy(() => import(/* webpackChunkName: "subject-module" */ "../modules/subjects/subjects"));
const StyleDemoComponent = lazy(() => import(/* webpackChunkName: "admin-modules" */ "../modules/styledemo/styledemo"));
const SettingsComponent = lazy(() => import(/* webpackChunkName: "small-modules" */ "../modules/settings/settings"));
const AdminComponent = lazy(() => import(/* webpackChunkName: "admin-modules" */ "../modules/admin/admin"));
const JrComponent = lazy(() => import(/* webpackChunkName: "admin-modules" */ "../modules/jr/songEdit"));

let priorModule = "";

export const getModuleComponent = moduleToLoad => {
  if (moduleToLoad === null) {
    return null;
  }
  let result = resolveModule(moduleToLoad, priorModule);
  priorModule = moduleToLoad;
  return result;
}
const resolveModule = (moduleToLoad, priorModule) => {
  let adminUser = isAdmin();
  let isNew = moduleToLoad != priorModule;

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
      isNew && booksPreload();
      return BooksComponent;
    case "home":
      return HomeComponent;
    case "scan":
      return ScanComponent;
    case "subjects":
      isNew && subjectsPreload();
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