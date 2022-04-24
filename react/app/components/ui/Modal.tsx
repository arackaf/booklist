import React, { SFC, useRef, useLayoutEffect, useState, useContext, useCallback, createContext, useMemo, FunctionComponent } from "react";

import { DialogOverlay, DialogContent } from "@reach/dialog";
import { useTransition, animated, config, useSpring } from "react-spring";

import "styles/reach-modal-overrides.scss";
import { useHeight } from "app/animationHelpers";

type ModalHeaderTypes = {
  focusClose?: boolean;
  onHide: any;
  caption: any;
  noClose?: boolean;
  smaller?: boolean;
};

export const StandardModalHeader: FunctionComponent<ModalHeaderTypes> = props => {
  let { onHide, caption, noClose, smaller, focusClose } = props;
  return (
    <>
      <div className="standard-reach-header">
        {smaller ? <h5 className="modal-title">{caption}</h5> : <h4 className="modal-title">{caption}</h4>}
        {!noClose ? (
          <a style={{ marginLeft: "auto" }} tabIndex={focusClose ? 0 : -1} className="close" onClick={onHide}>
            <span>&times;</span>
          </a>
        ) : null}
      </div>
      <hr />
    </>
  );
};

const AnimatedDialogOverlay = animated(DialogOverlay);
const AnimatedDialogContent = animated(DialogContent);

export const ModalSizingContext = createContext(null);

type ModalTypes = {
  isOpen: boolean;
  style?: any;
  onHide: any;
  headerCaption?: any;
  className?: string;
  focusRef?: any;
  focusHeaderCloseButton?: any;
  noClose?: boolean;
  smallerHeader?: boolean;
};
const Modal: FunctionComponent<ModalTypes> = props => {
  let { isOpen, onHide, headerCaption, noClose, focusHeaderCloseButton = false, focusRef = null, smallerHeader, style = {}, children } = props;

  const modalTransition = useTransition(!!isOpen, {
    config: isOpen ? { ...config.stiff } : { duration: 150 },
    from: { opacity: 0, transform: `translate3d(0px, -10px, 0px)` },
    enter: { opacity: 1, transform: `translate3d(0px, 0px, 0px)` },
    leave: { opacity: 0, transform: `translate3d(0px, 10px, 0px)` }
  });

  const animatModalSizing = useRef(true);
  const modalSizingPacket = useMemo(() => {
    return {
      disable() {
        animatModalSizing.current = false;
      },
      enable() {
        animatModalSizing.current = true;
      }
    };
  }, []);

  return (
    <ModalSizingContext.Provider value={modalSizingPacket}>
      {modalTransition(
        (styles, isOpen) =>
          isOpen && (
            <AnimatedDialogOverlay
              allowPinchZoom={true}
              initialFocusRef={focusRef}
              onDismiss={onHide}
              isOpen={isOpen}
              style={{ opacity: styles.opacity }}
            >
              <AnimatedDialogContent
                style={{
                  transform: styles.transform,
                  border: "4px solid hsla(0, 0%, 0%, 0.5)",
                  borderRadius: 10,
                  ...style
                }}
              >
                <ModalContents
                  focusClose={focusHeaderCloseButton}
                  content={children}
                  {...{ animatModalSizing, headerCaption, onHide, noClose, smallerHeader }}
                />
              </AnimatedDialogContent>
            </AnimatedDialogOverlay>
          )
      )}
    </ModalSizingContext.Provider>
  );
};

const ModalContents = ({ animatModalSizing, headerCaption, content, onHide, smallerHeader, noClose, focusClose }) => {
  const uiReady = useRef(false);
  const [sizingRef, contentHeight] = useHeight();

  const heightStyles =
    useSpring({
      immediate: !uiReady.current || !animatModalSizing.current,
      config: { ...config.stiff, friction: 33, tension: 425 },
      to: { height: contentHeight },
      onRest: () => (uiReady.current = true)
    }) || {};

  return (
    <animated.div style={{ overflow: "hidden", ...heightStyles }}>
      <div style={{ padding: "10px" }} ref={sizingRef}>
        {headerCaption ? (
          <StandardModalHeader focusClose={focusClose} caption={headerCaption} onHide={onHide} noClose={noClose} smaller={smallerHeader} />
        ) : null}
        {content}
      </div>
    </animated.div>
  );
};

export default Modal;
