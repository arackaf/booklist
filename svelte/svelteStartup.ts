import "css/fontawesome/css/font-awesome-booklist-build.css";
import "css/site-styles.scss";

import SvelteApp from "app/SvelteApp.svelte";
import ajaxUtil from "util/ajaxUtil";

const app = new SvelteApp({
  target: document.getElementById("home"),
  props: {}
});

ajaxUtil.post("/loginping", {}).then(val => {
  if (val.logout) {
    location.reload();
  }
});
