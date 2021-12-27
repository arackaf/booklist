import "./css/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./css/site-styles.scss";

import { renderUI } from "app/renderUI";

import "util/ajaxUtil";
import "util/graphql";
import ajaxUtil from "util/ajaxUtil";

import setupServiceWorker from "./util/setupServiceWorker";

setupServiceWorker();
renderUI();

ajaxUtil.post("/loginping", {}).then(val => {
  if (val.logout) {
    location.reload();
  }
});
