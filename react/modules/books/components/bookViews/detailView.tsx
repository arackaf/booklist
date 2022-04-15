import React, { useState, useLayoutEffect } from "react";

import Modal from "app/components/ui/Modal";
import { CoverSmall } from "app/components/bookCoverComponent";
import EditBook from "app/components/editBook/editBook";
import Stack from "app/components/layout/Stack";
import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags";
import DisplaySelectedSubjects from "app/components/subjectsAndTags/subjects/DisplaySelectedSubjects";
import FlowItems from "app/components/layout/FlowItems";

const DetailsView = props => {
  const { book, saveBook } = props;
  const [url, setUrl] = useState(null);
  const [urlPreview, setUrlPreview] = useState(null);
  const [editingBook, setEditingBook] = useState(false);

  useLayoutEffect(() => {
    setUrl(book ? book.mediumImage : null);
    setUrlPreview(book ? book.mediumImagePreview : null);
    if (props.isOpen) {
      setEditingBook(false);
    }
  }, [props.isOpen]);

  if (!book) return null;

  return (
    <Modal className="fade" isOpen={props.isOpen} onHide={props.onClose} headerCaption={book.title} noClose={true} smallerHeader={true}>
      {editingBook ? (
        <EditBook {...{ saveBook, book }} onCancel={() => setEditingBook(false)} title={book.title} />
      ) : (
        <div style={{ display: "flex", alignItems: "top" }}>
          <div>
            <div>
              <CoverSmall url={url} preview={urlPreview} dontSuspend={true} />
            </div>
          </div>
          <Stack tighter={true} style={{ paddingLeft: "10px" }}>
            {book.publisher || book.publicationDate ? (
              <FlowItems tightest={true}>
                <span>{book.publisher}</span>
                <span>{book.publicationDate}</span>
              </FlowItems>
            ) : null}
            <FlowItems>
              <div className="overlay-holder">
                <span>Tags:</span>
                <span style={{ visibility: "hidden" }}>Subjects:</span>
              </div>
              {book?.tags?.length ? <DisplaySelectedTags currentlySelected={book.tags || []} /> : <span style={{ fontStyle: "italic" }}>None</span>}
            </FlowItems>
            <FlowItems>
              <span>Subjects:</span>
              {book?.subjects?.length ? (
                <DisplaySelectedSubjects currentlySelected={book.subjects || []} />
              ) : (
                <span style={{ fontStyle: "italic" }}>None</span>
              )}
            </FlowItems>
            {book.isbn ? (
              <FlowItems tighter={true}>
                <a target="_new" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}>
                  <i className="fab fa-amazon" />
                </a>
                <a target="_new" href={`https://www.goodreads.com/book/isbn/${book.isbn}`}>
                  <i className="fab fa-goodreads-g" />
                </a>
              </FlowItems>
            ) : null}
            <div style={{ marginTop: "auto" }}>
              <button className="btn btn-xs" onClick={() => setEditingBook(true)}>
                Edit book <i className="fal fa-pencil-alt"></i>
              </button>
            </div>
          </Stack>
        </div>
      )}
    </Modal>
  );
};

export default DetailsView;
