import "assets/fontawesome/css/font-awesome-booklist-build.css";
import "css/site-styles.scss";

import "./vanillaWc";
import "./counter-wc";

import App from "./App";

const app = new App({
  target: document.getElementById("home"),
  props: {}
});
