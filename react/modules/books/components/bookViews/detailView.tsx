import React, { useState, useLayoutEffect } from "react";

import Modal from "app/components/modal";
import { getCrossOriginAttribute } from "util/corsHelpers";

const DetailsView = props => {
  const { book } = props;
  const [url, setUrl] = useState(null);
  useLayoutEffect(() => {
    setUrl(book ? book.mediumImage : null);
  }, [book]);

  const doEdit = () => {
    props.onClose();
    props.editBook(book);
  };

  if (!book) return null;
  return (
    <Modal className="fade" isOpen={props.isOpen} onHide={props.onClose}>
      <div style={{ display: "flex", alignItems: "top" }}>
        <div>
          <div style={{ width: "106px" }}>
            <img style={{ maxWidth: "100%" }} src={url} {...getCrossOriginAttribute(url)} />
          </div>
        </div>
        <div style={{ paddingLeft: "10px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginTop: 0 }}>{book.title}</h3>
          {book.publisher || book.publicationDate ? (
            <div>
              <span>{book.publisher}</span>
              <span style={{ paddingLeft: "10px" }}>{book.publicationDate}</span>
            </div>
          ) : null}
          {book.isbn ? <div>{book.isbn}</div> : null}
          <div className="margin-top margin-bottom">
            <button className="btn btn-xs" onClick={doEdit}>
              Edit book <i className="fal fa-pencil" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsView;
