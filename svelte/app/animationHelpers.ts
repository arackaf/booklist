import { getContext } from "svelte";
import { writable, derived, get } from "svelte/store";

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

export const makeContentTransition = () => {
  const moduleContext: any = getContext("module-context");
  return obj => {
    return { ...obj, duration: get<any>(moduleContext).active ? obj.duration : 0 };
  };
};
