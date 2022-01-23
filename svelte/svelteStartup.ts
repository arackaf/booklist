import "css/fontawesome/css/font-awesome-booklist-build.css";
import "css/site-styles.scss";

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
    ajaxUtil.postAuth("/loginping", {}).then(val => {
      if (val.logout) {
        location.reload();
      }
    });
  }
}
