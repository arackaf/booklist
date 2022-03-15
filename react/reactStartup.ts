import "react-toggle/style.css";
import "@reach/dialog/styles.css";
import "./css/fontawesome/css/all.min.css";
import "./css/site-styles.scss";

import { renderUI } from "app/renderUI";

import "util/ajaxUtil";
import "util/graphql";
import ajaxUtil from "util/ajaxUtil";

import setupServiceWorker from "./util/setupServiceWorker";
import { getLoginStatus, getCookieLookup, eraseCookie, isLoggedIn } from "util/loginStatus";
import { scanWebSocket, checkPendingCount, dispatchScanDataUpdate } from "util/scanUtils";
import { getCurrentModuleFromUrl } from "app/state/appState";
import { doModulePreload } from "app/modulePreloads";

setupServiceWorker();
renderUI();

const user = getLoginStatus();
const cookieData = getCookieLookup();

if (cookieData.email && !cookieData.newAuth2) {
  ["email", "userId", "loginToken", "remember_me", "logged_in", "admin", "remember_me", "newAuth"].forEach(eraseCookie);
  location.reload();
} else {
  const initialModule = getCurrentModuleFromUrl();
  doModulePreload(initialModule);

  if (isLoggedIn()) {
    checkPendingCount();
    const cookieHash = getCookieLookup();
    scanWebSocket.send({ action: "sync", userId: cookieHash.userId, loginToken: cookieHash.loginToken });

    scanWebSocket.addHandler(data => {
      let packet = JSON.parse(data);

      dispatchScanDataUpdate(packet);
    });
  }

  if (user.userId) {
    ajaxUtil.postAuth("/loginping", {}).then(val => {
      if (val.logout) {
        location.reload();
      }
    });
  }
}
