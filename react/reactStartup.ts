import { useSpring, useTransition, animated, config, useSprings } from "react-spring";
(window as any).__bundleControl = { useSpring, useTransition, animated, config, useSprings };

import "./static/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./css/site-styles.scss";

import { renderUI } from "app/renderUI";
import { history } from "util/urlHelpers";

import "util/ajaxUtil";
import "util/graphql";

import setupServiceWorker from "./util/setupServiceWorker";
import { getCurrentUrlState } from "util/urlHelpers";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("!!!! UPDATING !!!!");
    console.log("!!!! UPDATING !!!!");
    console.log("!!!! UPDATING !!!!");
    console.log("!!!! UPDATING !!!!");
    console.log("!!!! UPDATING !!!!");
    setTimeout(() => {
      updateSW(true);
    }, 10000);
  },
  onOfflineReady() {}
});

console.log("HELLO WORLD 6");

//setupServiceWorker();
renderUI();

export function goto(module) {
  var userId = getCurrentUrlState().searchState.userId;
  let currentModule = history.location.pathname.replace(/\//g, "").toLowerCase();

  if (currentModule !== module) {
    history.push({ pathname: `/${module}`, search: userId ? `userId=${userId}` : void 0 });
  }
}
