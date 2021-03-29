import React, { useState, useLayoutEffect } from "react";

import Modal from "app/components/ui/Modal";
import { CoverSmall } from "app/components/bookCoverComponent";
import EditBook from "app/components/editBook/editBook";

const DetailsView = props => {
  const { book, saveBook } = props;
  const [url, setUrl] = useState(null);
  useLayoutEffect(() => {
    setUrl(book ? book.mediumImage : null);
  }, [book]);

  const [editingBook, setEditingBook] = useState(false);

  if (!book || !props.isOpen) return null;

  return (
    <Modal className="fade" isOpen={props.isOpen} onHide={props.onClose}>
      {editingBook ? (
        <EditBook {...{ saveBook, book }} title={book.title} />
      ) : (
        <div style={{ display: "flex", alignItems: "top" }}>
          <div>
            <div style={{ width: "106px" }}>
              <CoverSmall url={url} />
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
              <button className="btn btn-xs" onClick={() => setEditingBook(true)}>
                Edit book <i className="fal fa-pencil-alt"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DetailsView;
