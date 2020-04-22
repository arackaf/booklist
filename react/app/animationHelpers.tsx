import React, { Children } from "react";
import { useRef, useEffect, useState, useLayoutEffect } from "react";

import { TransitionGroup, CSSTransition } from "react-transition-group";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

export function useHeight({ on } = {} as any) {
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

export const SlideInContents = ({ className = "", style = {}, fast = false, children }) => {
  const allChildren = Children.toArray(children);
  const Child = allChildren[0];
  const on = Child != null;

  const [ref, currentHeight] = useHeight({ on });
  const [showing, setShowing] = useState(false);
  const height = showing ? `${currentHeight}px` : 0;

  return (
    <TransitionGroup>
      {on ? (
        <CSSTransition
          classNames="bl-animate"
          onEntering={() => setShowing(true)}
          onExiting={() => setShowing(false)}
          timeout={fast ? 150 : 300}
          key={1}
        >
          <div className={"bl-slide-down " + className} style={{ ...style, height }}>
            <div ref={ref}>{Child}</div>
          </div>
        </CSSTransition>
      ) : null}
    </TransitionGroup>
  );
};
