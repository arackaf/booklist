import React, { createElement } from "react";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import cn from "classnames";
import { CSSTransition } from "react-transition-group";

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

export const SlideInContents = ({
  in: inProp = void 0,
  component = "div",
  className = "",
  style = {} as any,
  fast = false,
  key = 1,
  children,
  animateMountingOnly = false,
  timeout = null,
  ...rest
}) => {
  const [ref, currentHeight] = useHeight({ inProp });
  const [showing, setShowing] = useState(inProp);
  const height = showing ? `${currentHeight}px` : 0;

  return (
    <CSSTransition
      in={inProp}
      classNames="bl-animate"
      onEntering={() => setShowing(true)}
      onExiting={() => setShowing(false)}
      timeout={timeout || (fast ? 150 : 300)}
      key={key}
      {...rest}
    >
      {createElement(
        component,
        { className: cn("bl-slide-down", className, { ["height-auto-when-active"]: animateMountingOnly }), style: { height, ...style } },
        <div ref={ref}>{children}</div>
      )}
    </CSSTransition>
  );
};
