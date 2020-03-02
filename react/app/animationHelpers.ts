import { useRef, useEffect, useState, useLayoutEffect } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

export function useMeasure() {
  const ref = useRef<any>();
  const [bounds, set] = useState({ height: 0 });
  const [ro] = useState(() => new MutationObserver(() => ref.current && set({ height: ref.current.offsetHeight })));
  useLayoutEffect(() => {
    if (ref.current) {
      set({ height: ref.current.offsetHeight });
    }
  }, []);
  useEffect(() => {
    if (ref.current) {
      ro.observe(ref.current, { childList: true, subtree: true });
    }
    return () => ro.disconnect();
  }, []);
  return [ref, bounds as any];
}
