import "assets/fontawesome/css/font-awesome-booklist-build.css";
import "css/site-styles.scss";

import SvelteApp from "app/SvelteApp.svelte";

const app = new SvelteApp({
  target: document.getElementById("home"),
  props: {}
});
