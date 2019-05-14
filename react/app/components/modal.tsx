import React, { Component, useRef, useLayoutEffect } from "react";

import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { Transition, config } from "react-spring";

import "css/reach-modal-overrides.css";

export class StandardModalHeader extends Component<{ onHide: any; caption: any }, any> {
  render() {
    let { onHide, caption } = this.props;
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
  }
}

type ModalTypes = { isOpen: boolean; style?: any; onHide: any; headerCaption?: any; className?: string; focusRef?: any };
export default class Modal extends Component<ModalTypes, any> {
  render() {
    let { isOpen, onHide, headerCaption, focusRef = null, style = { maxWidth: "600px" }, children } = this.props;
    return (
      <Transition
        config={{ ...config.gentle, overshootClamping: true }}
        from={{ opacity: 0, y: -10 }}
        enter={{ opacity: 1, y: 0 }}
        leave={{ opacity: 0, y: 10 }}
      >
        {isOpen
          ? (styles: any) => (
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
            )
          : null}
      </Transition>
    );
  }
}
