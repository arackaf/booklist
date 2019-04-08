import React, { Component, useRef } from "react";
import BootstrapButton, { BootstrapAnchorButton, AjaxButton } from "applicationRoot/components/bootstrapButton";
import Dropzone from "react-dropzone";

import ajaxUtil from "util/ajaxUtil";
import Modal from "applicationRoot/components/modal";

const DetailsView = props => {
  let { book } = props;
  const focusRef = useRef(null);

  if (!book) return null;
  return (
    <Modal className="fade" isOpen={props.isOpen} onHide={props.onClose} focusRef={focusRef}>
      <div style={{ display: "flex", alignItems: "top" }}>
        <div>
          <img src={book.mediumImage} />
        </div>
        <div style={{ paddingLeft: "10px", display: "flex", flexDirection: "column" }}>
          <h3 ref={focusRef} style={{ marginTop: 0 }}>
            {book.title}
          </h3>
          {book.publisher || book.publicationDate ? (
            <div>
              <span>{book.publisher}</span>
              <span style={{ paddingLeft: "10px" }}>{book.publicationDate}</span>
            </div>
          ) : null}
          {book.isbn ? <div>{book.isbn}</div> : null}
          <div style={{ marginTop: "auto" }}>
            <div className="btn-group">
              <input className="form-control" placeholder="New Cover URL" />
              <button className="btn btn-default">
                <i className="far fa-cloud-upload-alt" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsView;
