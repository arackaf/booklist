import React, { lazy } from "react";
import { useRef, useLayoutEffect } from "react";

const LazyModal = lambda => props => {
  const everOpen = useRef(props.isOpen);
  const LazyComponent = useRef(lazy(lambda));

  useLayoutEffect(() => {
    everOpen.current = props.isOpen;
  }, [props.isOpen]);

  return everOpen.current || props.isOpen ? <LazyComponent.current {...props} /> : null;
};

export default LazyModal;
