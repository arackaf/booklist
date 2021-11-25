import Toastify from "toastify-js";
import { registerSW } from "virtual:pwa-register";

import { isLoggedIn } from "util/loginStatus";

export default function setupServiceWorker() {
  if ("serviceWorker" in navigator && !/localhost/.test(window.location) && !/lvh.me/.test(window.location)) {
    const updateSW = registerSW({
      onNeedRefresh() {
        Toastify({
          text: `
            <h4 style='display: inline'>An update is available!</h4>
            <br><br>
            <a class='do-sw-update'>Click to update and reload</a>&nbsp;&nbsp;
          `.trim(),
          escapeMarkup: false,
          duration: 700000,
          gravity: "bottom",
          close: true,
          className: "toast-notification",
          onClick() {
            updateSW(true);
          }
        }).showToast();
      },
      onOfflineReady() {},
      onRegistered() {
        let loginInfo = isLoggedIn();

        if (loginInfo.logged_in) {
          navigator.serviceWorker.controller.postMessage({ command: "do-sync", userId: loginInfo.userId });
        } else {
          navigator.serviceWorker.controller.postMessage({ command: "logged-out" });
        }
      }
    });
  }
}
