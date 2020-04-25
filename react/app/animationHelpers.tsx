import React, { Children, createElement } from "react";
import { useRef, useEffect, useState, useLayoutEffect } from "react";

import { TransitionGroup, CSSTransition } from "react-transition-group";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

export function useHeight({ on = true /* no value means on */ } = {} as any) {
  const ref = useRef<any>();
  const [height, set] = useState(0);
  const [ro] = useState(() => new MutationObserver(() => ref.current && height != ref.current.offsetHeight && set(ref.current.offsetHeight)));
  useLayoutEffect(() => {
    if (on && ref.current) {
      set(ref.current.offsetHeight);
      ro.observe(ref.current, { attributes: true, childList: true, subtree: true });
    }
    return () => ro.disconnect();
  }, [on]);

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
      timeout={fast ? 150 : 300}
      key={key}
      {...rest}
    >
      {createElement(component, { className: "bl-slide-down " + className, style: { height, ...style } }, <div ref={ref}>{children}</div>)}
    </CSSTransition>
  );
};
