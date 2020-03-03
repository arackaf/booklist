import { useRef, useEffect, useState, useLayoutEffect } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

export function useHeight() {
  const ref = useRef<any>();
  const [height, set] = useState(0);
  const [ro] = useState(() => new MutationObserver(() => ref.current && height != ref.current.offsetHeight && set(ref.current.offsetHeight)));
  useLayoutEffect(() => {
    if (ref.current) {
      set(ref.current.offsetHeight);
      ro.observe(ref.current, { attributes: true, childList: true, subtree: true });
    }
    return () => ro.disconnect();
  }, []);

  return [ref, height as any];
}
