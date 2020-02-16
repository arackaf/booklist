import React, { Component, SFC } from "react";

import { DialogOverlay, DialogContent } from "@reach/dialog";
import { Transition, config } from "react-spring/renderprops";

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

type ModalTypes = { isOpen: boolean; style?: any; onHide: any; headerCaption?: any; className?: string; focusRef?: any };
const Modal: SFC<ModalTypes> = props => {
  let { isOpen, onHide, headerCaption, focusRef = null, style = { maxWidth: "600px" }, children } = props;
  return (
    <Transition
      items={!!isOpen}
      config={isOpen ? { mass: 1, tension: 350, friction: 30 } : { duration: 150 }}
      from={{ opacity: 0, y: -10 }}
      enter={{ opacity: 1, y: 0 }}
      leave={{ opacity: 0, y: 10 }}
    >
      {isOpen =>
        isOpen &&
        ((styles: any) => (
          <DialogOverlay initialFocusRef={focusRef} onDismiss={onHide} isOpen={isOpen} style={{ opacity: styles.opacity }}>
            <DialogContent
              style={{
                transform: `translate3d(0px, ${styles.y}px, 0px)`,
                border: "4px solid hsla(0, 0%, 0%, 0.5)",
                borderRadius: 10,
                ...style
              }}
            >
              {headerCaption ? <StandardModalHeader caption={headerCaption} onHide={onHide} /> : null}
              {children}
            </DialogContent>
          </DialogOverlay>
        ))
      }
    </Transition>
  );
};

export default Modal;
