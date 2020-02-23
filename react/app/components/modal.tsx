import React, { Component, SFC } from "react";

import { DialogOverlay, DialogContent } from "@reach/dialog";
import { Transition } from "react-spring/renderprops";
import { useTransition, animated } from "react-spring";

import "css/reach-modal-overrides.scss";

export const StandardModalHeader: SFC<{ onHide: any; caption: any }> = props => {
  let { onHide, caption } = props;
  return (
    <>
      <div className="standard-reach-header">
        <h4 className="modal-title">{caption}</h4>
        <a style={{ marginLeft: "auto" }} className="close" onClick={onHide}>
          <span>&times;</span>
        </a>
      </div>
      <hr />
    </>
  );
};

const AnimatedDialogOverlay = animated(DialogOverlay);
const AnimatedDialogContent = animated(DialogContent);

type ModalTypes = { isOpen: boolean; style?: any; onHide: any; headerCaption?: any; className?: string; focusRef?: any };
const Modal: SFC<ModalTypes> = props => {
  let { isOpen, onHide, headerCaption, focusRef = null, style = { maxWidth: "600px" }, children } = props;

  const modalMaybe = useTransition(!!isOpen, null, {
    config: isOpen ? { mass: 1, tension: 350, friction: 30 } : { duration: 150 },
    from: { opacity: 0, transform: `translate3d(0px, -10px, 0px)` },
    enter: { opacity: 1, transform: `translate3d(0px, 0px, 0px)` },
    leave: { opacity: 0, transform: `translate3d(0px, 10px, 0px)` }
  });

  let results = modalMaybe.map(({ item: isOpen, props: styles }: any) => {
    if (isOpen) console.log(isOpen, "---", styles);
    return (
      isOpen && (
        <AnimatedDialogOverlay initialFocusRef={focusRef} onDismiss={onHide} isOpen={isOpen} style={{ opacity: styles.opacity }}>
          <AnimatedDialogContent
            style={{
              transform: styles.transform,
              border: "4px solid hsla(0, 0%, 0%, 0.5)",
              borderRadius: 10,
              ...style
            }}
          >
            {headerCaption ? <StandardModalHeader caption={headerCaption} onHide={onHide} /> : null}
            {children}
          </AnimatedDialogContent>
        </AnimatedDialogOverlay>
      )
    );
  });
  return results.find(item => item) || null;
};

export default Modal;
