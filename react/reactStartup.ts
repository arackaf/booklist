import "./css/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./css/site-styles.scss";

import { renderUI } from "app/renderUI";

import "util/ajaxUtil";
import "util/graphql";

import setupServiceWorker from "./util/setupServiceWorker";

setupServiceWorker();
renderUI();
