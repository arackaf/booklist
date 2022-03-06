import { lazy } from "react";

import { isAdmin } from "util/loginStatus";

import booksPreload, { subjectsAndTagsNonPublicPreload } from "../modules/books/booksPreload";
import subjectsPreload from "../modules/subjects/subjectsPreload";
import { doModulePreload } from "./modulePreloads";

const ActivateComponent = lazy(() => import("../modules/activate/activate"));
const AuthenticateComponent = lazy(() => import("../modules/authenticate/authenticate"));
const BooksComponent = lazy(() => import("../modules/books/books"));
const HomeComponent = lazy(() => import("../modules/home/home"));
const ScanComponent = lazy(() => import("../modules/scan/scan"));
const SubjectsComponent = lazy(() => import("../modules/subjects/subjects"));
const StyleDemoComponent = lazy(() => import("../modules/styledemo/styledemo"));
const SettingsComponent = lazy(() => import("../modules/settings/settings"));
const AdminComponent = lazy(() => import("../modules/admin/admin"));

export const getModuleComponent = moduleToLoad => {
  if (moduleToLoad === null) {
    return null;
  }
  return resolveModule(moduleToLoad);
};
const resolveModule = moduleToLoad => {
  let adminUser = isAdmin();

  if (moduleToLoad == "admin" && !adminUser) {
    return HomeComponent;
  }
  moduleToLoad = moduleToLoad.toLowerCase();
  doModulePreload(moduleToLoad);

  switch (moduleToLoad) {
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
      subjectsAndTagsNonPublicPreload();
      return ScanComponent;
    case "subjects":
      subjectsPreload();
      return SubjectsComponent;
    case "styledemo":
      return StyleDemoComponent;
    case "settings":
      return SettingsComponent;
    case "admin":
      return AdminComponent;
  }

  return HomeComponent;
};
