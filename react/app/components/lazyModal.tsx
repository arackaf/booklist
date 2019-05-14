import React from "react";
import { useRef, useLayoutEffect } from "react";

const LazyModal = Component => props => {
  const everOpen = useRef(props.isOpen);
  useLayoutEffect(() => {
    everOpen.current = props.isOpen;
  }, [props.isOpen]);

  return everOpen.current || props.isOpen ? <Component {...props} /> : null;
};

export default LazyModal;
