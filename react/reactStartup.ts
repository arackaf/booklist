import "react-spring";

import "./static/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./css/site-styles.scss";

import { renderUI } from "app/renderUI";
import { history } from "util/urlHelpers";

import "util/ajaxUtil";
import "util/graphql";

import setupServiceWorker from "./util/setupServiceWorker";
import { getCurrentUrlState } from "util/urlHelpers";

setupServiceWorker();
renderUI();

export function goto(module) {
  var userId = getCurrentUrlState().searchState.userId;
  let currentModule = history.location.pathname.replace(/\//g, "").toLowerCase();

  if (currentModule !== module) {
    history.push({ pathname: `/${module}`, search: userId ? `userId=${userId}` : void 0 });
  }
}
