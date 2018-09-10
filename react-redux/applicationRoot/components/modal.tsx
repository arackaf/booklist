import React, { Component } from "react";

import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { Transition, config } from "react-spring";

export class StandardModalHeader extends Component<{ onHide: any; caption: any }, any> {
  render() {
    let { onHide, caption } = this.props;
    return (
      <>
        <button type="button" className="close" onClick={onHide} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 className="modal-title">{caption}</h4>
        <hr />
      </>
    );
  }
}

export default class Modal extends Component<{ isOpen: boolean; style?: any; onHide: any; headerCaption?: any; className?: string }, any> {
  render() {
    let { isOpen, onHide, headerCaption, style = { maxWidth: "600px" }, children } = this.props;
    return (
      <Transition
        config={{ ...config.gentle, overshootClamping: true }}
        from={{ opacity: 0, y: -10 }}
        enter={{ opacity: 1, y: 0 }}
        leave={{ opacity: 0, y: 10 }}
      >
        {isOpen
          ? (styles: any) => (
              <DialogOverlay onDismiss={onHide} isOpen={isOpen} style={{ opacity: styles.opacity }}>
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
