import { useRef, useEffect, useState } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

export function useMeasure() {
  const ref = useRef<any>();
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [ro] = useState(() => new MutationObserver(() => ref.current && set(ref.current.contentRect)));
  useEffect(() => {
    if (ref.current) ro.observe(ref.current, { attributes: true, childList: true, subtree: true });
    return () => ro.disconnect();
  }, []);
  return [{ ref }, bounds];
}
