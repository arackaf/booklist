import "styles/fontawesome/css/all.min.css";
import "styles/site-styles.scss";

import { getLoginStatus, getCookieLookup, eraseCookie } from "util/loginStatus";

import SvelteApp from "app/SvelteApp.svelte";
import ajaxUtil from "util/ajaxUtil";

const app = new SvelteApp({
  target: document.getElementById("home"),
  props: {}
});

const user = getLoginStatus();
const cookieData = getCookieLookup();

if (cookieData.email && !cookieData.newAuth) {
  ["email", "userId", "loginToken", "remember_me", "logged_in", "admin", "remember_me"].forEach(eraseCookie);
  location.reload();
} else {
  if (user.userId) {
    ajaxUtil
      .postAuth("/loginping", {})
      .then(val => {
        if (val.refresh) {
          location.reload();
        }
      })
      .catch(er => {
        ["email", "userId", "loginToken", "remember_me", "logged_in", "admin", "remember_me", "newAuth"].forEach(eraseCookie);
        location.reload();
      });
  }
}
