import "./css/fontawesome/css/all.min.css";
import "@reach/dialog/styles.css";
import "./css/site-styles.scss";

import { renderUI } from "app/renderUI";

import "util/ajaxUtil";
import "util/graphql";
import ajaxUtil from "util/ajaxUtil";

import setupServiceWorker from "./util/setupServiceWorker";
import { getLoginStatus, getCookieLookup, eraseCookie } from "util/loginStatus";

setupServiceWorker();
renderUI();

const user = getLoginStatus();
const cookieData = getCookieLookup();

if (cookieData.email && !cookieData.newAuth) {
  ["email", "userId", "loginToken", "remember_me", "logged_in", "admin", "remember_me"].forEach(eraseCookie);
  location.reload();
} else {
  if (user.userId) {
    ajaxUtil.postAuth("/loginping", {}).then(val => {
      if (val.logout) {
        location.reload();
      }
    });
  }
}
