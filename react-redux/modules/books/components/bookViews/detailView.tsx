import React, { Component, useRef, useState, useContext, useLayoutEffect } from "react";

import ajaxUtil from "util/ajaxUtil";
import Modal from "applicationRoot/components/modal";
import { AppContext } from "applicationRoot/renderUI";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import { syncUpdates } from "applicationRoot/graphqlHelpers";

const DetailsView = props => {
  const { book } = props;
  const [url, setUrl] = useState(null);
  useLayoutEffect(() => {
    setUrl(book ? book.mediumImage : null);
  }, [book]);
  const focusRef = useRef(null);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [savingNewImageUrl, setSavingNewImageUrl] = useState(false);
  const [{ userId }] = useContext(AppContext);

  const saveImage = () => {
    setSavingNewImageUrl(true);
    ajaxUtil.post("/book/newMediumImage", { _id: book._id, userId, url: newImageUrl }).then(({ url, failure }) => {
      if (!failure && url) {
        setUrl(url);
        syncUpdates(GetBooksQuery, { _id: book._id, mediumImage: url }, "allBooks", "Books", { force: true });
      }
      setSavingNewImageUrl(false);
    });
  };

  const keyDown = evt => {
    if (evt.keyCode == 13) {
      saveImage();
    }
  };

  if (!book) return null;
  return (
    <Modal className="fade" isOpen={props.isOpen} onHide={props.onClose} focusRef={focusRef}>
      <div style={{ display: "flex", alignItems: "top" }}>
        <div>
          <img src={url} crossOrigin="anonymous" />
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
              <input
                onKeyDown={keyDown}
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                className="form-control"
                placeholder="New Cover URL"
              />
              <button className="btn btn-default" disabled={!newImageUrl || savingNewImageUrl} onClick={saveImage}>
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
