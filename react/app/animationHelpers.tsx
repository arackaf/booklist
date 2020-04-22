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

export const SlideInContents = ({ fast = false, children }) => {
  const allChildren = Children.toArray(children);
  const Child = allChildren[0];
  const on = Child != null;
  
  const [ref, height] = useHeight({ on });

  return (
    <TransitionGroup>
      {on ? (
        <CSSTransition
          classNames="bl-animate"
          onEntering={node => {
            // debugger;
            node.style.height = `${height}px`;
          }}
          timeout={fast ? 150 : 300}
          key={1}
        >
          <div className="bl-slide-down" style={{ overflow: "hidden" }}>
            <div ref={ref}>{Child}</div>
          </div>
        </CSSTransition>
      ) : null}
    </TransitionGroup>
  );
};
