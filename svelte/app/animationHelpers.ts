import { writable, derived } from "svelte/store";

export function syncHeight(el) {
  return writable(el.offsetHeight, (set) => {
    if (!el) {
      return;
    }

    let ro = new ResizeObserver(() => el && set(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  });
}

export function syncWidth(el) {
  return writable(el.offsetWidth, (set) => {
    if (!el) {
      return;
    }

    let ro = new ResizeObserver(() => el && set(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  });
}
