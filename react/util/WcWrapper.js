import React, { createElement, useRef, useLayoutEffect, memo } from "react";

const _WcWrapper = props => {
  const { wcTag, children, ...restProps } = props;
  const wcRef = useRef(null);

  useLayoutEffect(() => {
    const wc = wcRef.current;

    for (const [key, value] of Object.entries(restProps)) {
      if (key in wc) {
        if (wc[key] !== value) {
          wc[key] = value;
        }
      } else {
        if (wc.getAttribute(key) !== value) {
          wc.setAttribute(key, value);
        }
      }
    }
  });

  return createElement(wcTag, { ref: wcRef });
};

export const WcWrapper = memo(_WcWrapper);
