import { getContext } from "svelte";
import { writable, derived, get } from "svelte/store";
import { appState } from "./state/appState";

export function syncHeight(el) {
  return writable(el.offsetHeight, set => {
    if (!el) {
      return;
    }

    let ro = new ResizeObserver(() => el && set(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  });
}

export function syncWidth(el) {
  return writable(el.offsetWidth, set => {
    if (!el) {
      return;
    }

    let ro = new ResizeObserver(() => el && set(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  });
}

import { spring } from "svelte/motion";

const OPEN_SPRING = { stiffness: 0.1, damping: 0.4 };
const CLOSE_SPRING = { stiffness: 0.2, damping: 0.8 };
const STIFF_DOWN_SPRING = { stiffness: 0.2, damping: 0.6 };
const FADE_SPRING = { stiffness: 0.2, damping: 0.8 };

function getHeightSpring() {
  const heightSpring = spring(0, OPEN_SPRING);
  let shown = false;

  const getConfig = (open, val) => {
    let active = typeof val === "number";
    let immediate = open && !shown && active;
    //once we've had a proper height registered, we can animate in the future
    shown = shown || active;
    return immediate ? { hard: true } : {};
  };

  const sync = (open, height) => {
    heightSpring.set(open ? height || 0 : 0, getConfig(open, height));
  };

  return { sync, heightSpring };
}

export default function slideAnimate(el, { open, fade, stiffDown = false }) {
  el.parentNode.style.overflow = "hidden";

  const { heightSpring, sync } = getHeightSpring();
  const doUpdate = () => sync(open, currentHeight);
  const fadeSpring = spring(open ? 1 : 0, FADE_SPRING);

  let currentHeight = null;
  const ro = new ResizeObserver(() => {
    const parentStyles = getComputedStyle(el.parentNode);
    const padding = parseFloat(parentStyles.getPropertyValue("padding-top")) + parseFloat(parentStyles.getPropertyValue("padding-bottom"));
    const newHeight = el.offsetHeight + padding;

    const bigger = newHeight > currentHeight;

    if (typeof currentHeight === "number") {
      Object.assign(heightSpring, bigger ? (stiffDown ? STIFF_DOWN_SPRING : OPEN_SPRING) : CLOSE_SPRING);
    }
    currentHeight = newHeight;
    doUpdate();
  });

  const heightSpringCleanup = heightSpring.subscribe(height => {
    el.parentNode.style.height = `${height}px`;
  });

  let fadeSpringCleanup;
  if (fade) {
    fadeSpringCleanup = fadeSpring.subscribe(opacity => {
      el.parentNode.style.opacity = opacity;
    });
  }

  ro.observe(el);

  return {
    update({ open: isOpen }) {
      open = isOpen;
      Object.assign(heightSpring, open ? (stiffDown ? STIFF_DOWN_SPRING : OPEN_SPRING) : CLOSE_SPRING);
      fadeSpring.set(open ? 1 : 0);
      doUpdate();
    },
    destroy() {
      ro.disconnect();
      heightSpringCleanup();
      fadeSpringCleanup?.();
    }
  };
}