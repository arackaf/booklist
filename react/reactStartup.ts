import { useSpring, useTransition, animated, config, useSprings } from "react-spring";
(window as any).__bundleControl = { useSpring, useTransition, animated, config, useSprings };

import "./static/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./css/site-styles.scss";

import { renderUI } from "app/renderUI";

import "util/ajaxUtil";
import "util/graphql";

import setupServiceWorker from "./util/setupServiceWorker";

setupServiceWorker();
renderUI();
