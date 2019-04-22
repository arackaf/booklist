import React, { useState, useLayoutEffect } from "react";

import Modal from "applicationRoot/components/modal";

const DetailsView = props => {
  const { book } = props;
  const [url, setUrl] = useState(null);
  useLayoutEffect(() => {
    setUrl(book ? book.mediumImage : null);
  }, [book]);

  if (!book) return null;
  return (
    <Modal className="fade" isOpen={props.isOpen} onHide={props.onClose}>
      <div style={{ display: "flex", alignItems: "top" }}>
        <div>
          <img src={url} crossOrigin="anonymous" />
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
        </div>
      </div>
    </Modal>
  );
};

export default DetailsView;
