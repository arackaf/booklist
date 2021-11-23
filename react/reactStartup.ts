import { useSpring, useTransition, animated, config, useSprings } from "react-spring";
(window as any).__bundleControl = { useSpring, useTransition, animated, config, useSprings };

import "./static/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./css/site-styles.scss";

import { renderUI } from "app/renderUI";

import "util/ajaxUtil";
import "util/graphql";

import { registerSW } from "virtual:pwa-register";

import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

if ("serviceWorker" in navigator) {
  // && !/localhost/.test(window.location) && !/lvh.me/.test(window.location)) {

  const updateSW = registerSW({
    onNeedRefresh() {
      Toastify({
        text: `<h4 style='display: inline'>An update is available!</h4>
               <br><br>
               <a class='do-sw-update'>Click to update and reload</a>&nbsp;&nbsp;`,
        escapeMarkup: false,
        gravity: "bottom",
        onClick() {
          updateSW(true);
        }
      }).showToast();
    }
  });
}

renderUI();
