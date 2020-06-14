import React, { createElement } from "react";
import { useRef, useEffect, useState, useLayoutEffect } from "react";

import { useSpring, config, animated } from "react-spring";

declare var ResizeObserver;

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

export function useHeight({ on = true /* no value means on */ } = {} as any) {
  const ref = useRef<any>();
  const [height, set] = useState(0);
  const heightRef = useRef(height);
  const [ro] = useState(
    () =>
      new ResizeObserver(packet => {
        if (ref.current && heightRef.current != ref.current.offsetHeight) {
          heightRef.current = ref.current.offsetHeight;
          set(ref.current.offsetHeight);
        }
      })
  );
  useLayoutEffect(() => {
    if (on && ref.current) {
      set(ref.current.offsetHeight);
      ro.observe(ref.current, { attributes: true, childList: true, subtree: true });
    }
    return () => ro.disconnect();
  }, [on, ref.current]);

  return [ref, height as any];
}

export const SlideInContents = ({ in: inProp = void 0, component = "div", style = {} as any, children, ...rest }) => {
  const [ref, currentHeight] = useHeight({ inProp });
  const initialHeight = useRef(inProp ? "auto" : 0);

  const scanInfoStyles =
    useSpring({
      config: { ...config.stiff, clamp: !inProp },
      from: { height: initialHeight },
      to: { height: inProp ? currentHeight : 0 }
    }) || {};

  const componentType = animated[component];
  return createElement(componentType, { style: { overflow: "hidden", ...style, ...scanInfoStyles }, ...rest }, <div ref={ref}>{children}</div>);
};
