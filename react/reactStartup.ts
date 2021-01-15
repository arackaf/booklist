import { useSpring, useTransition, animated, config, useSprings } from "react-spring";
(window as any).__bundleControl = { useSpring, useTransition, animated, config, useSprings };

import "./static/fontawesome/css/font-awesome-booklist-build.css";
import "@reach/dialog/styles.css";
import "./css/site-styles.scss";

import { history } from "util/urlHelpers";

import "util/ajaxUtil";
import "util/graphql";

import setupServiceWorker from "./util/setupServiceWorker";
import { getCurrentUrlState } from "util/urlHelpers";

setupServiceWorker();

export function goto(module) {
  var userId = getCurrentUrlState().searchState.userId;
  let currentModule = history.location.pathname.replace(/\//g, "").toLowerCase();

  if (currentModule !== module) {
    history.push({ pathname: `/${module}`, search: userId ? `userId=${userId}` : void 0 });
  }
}

customElements.define(
  "my-paragraph",
  class extends HTMLElement {
    constructor() {
      super();

      let template = document.getElementById("my-paragraph");
      let templateContent = template.content;
      const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(templateContent.cloneNode(true));
    }
  }
);

document.body.appendChild(document.createElement("my-paragraph"));

const el = document.body.querySelector("my-paragraph");
const X = el.shadowRoot;
debugger;