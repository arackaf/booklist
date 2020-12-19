import { writable, derived } from "svelte/store";

export default function syncHeight(el) {
  const store = writable(null, (set) => {
    if (!el) {
      return;
    }

    let ro = new ResizeObserver(() => el && set(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  });

  return derived(store, $val => $val);
}
