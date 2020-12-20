import { writable, derived } from "svelte/store";

export default function syncHeight(el) {
  return writable(el.offsetHeight, (set) => {
    if (!el) {
      return;
    }

    let ro = new ResizeObserver(() => el && set(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  });
}
