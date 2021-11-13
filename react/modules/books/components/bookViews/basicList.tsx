import React, { FunctionComponent, SFC, useContext } from "react";
import { ActionButton } from "app/components/ui/Button";
import { AppContext } from "app/renderUI";

import { CoverSmall } from "app/components/bookCoverComponent";
import { BooksModuleContext } from "modules/books/books";
import useDelete from "app/helpers/useDelete";

import "./uiStyles.scss";
import "./basicList.scss";

const BookViewListMobileItem = props => {
  const { book, online, runDelete } = props;

  const [startDelete, cancelDelete, doDelete, pendingDelete, deleting] = useDelete(() => runDelete(book._id));

  return (
    <div className="list-group-item">
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "5px", minWidth: "55px" }}>
          <CoverSmall url={book.smallImage} />
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div className="list-group-item-heading book-title">{book.title}</div>
            <span className="list-group-item-text book-author">{book.authors.length ? book.authors.join(", ") : ""}</span>
            <div style={{ marginTop: "auto" }}>
              {!props.viewingPublic && online ? (
                <>
                  <button className="btn btn-xs btn-light btn-round-icon" onClick={() => props.editBook(book)}>
                    <i className="fal fa-pencil-alt"></i>
                  </button>
                  <button style={{ marginLeft: "5px" }} className="btn btn-xs btn-light btn-round-icon" onClick={startDelete}>
                    <i className="fa fa-fw fa-trash" />
                  </button>
                </>
              ) : null}
              {pendingDelete ? (
                <ActionButton text="Confirm Delete" runningText="Deleting" onClick={doDelete} className="margin-left btn btn-xxs btn-danger">
                  Confirm Delete
                </ActionButton>
              ) : null}
              {pendingDelete ? (
                <button onClick={cancelDelete} disabled={deleting} className="margin-left btn btn-xxs">
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookViewListMobile: FunctionComponent<{ books: any }> = props => {
  const { actions, booksUiState } = useContext(BooksModuleContext);
  const { runDelete, editBook } = actions;

  const [{ online, isPublic }] = useContext(AppContext);

  return (
    <div className="book-display-basic-list">
      <div style={{ paddingBottom: 15 }}>
        <div style={{ border: 0 }} className="list-group docked-to-panel">
          {props.books.map((book, i) => (
            <BookViewListMobileItem key={book._id} {...{ book, editBook, booksUiState, online, runDelete }} viewingPublic={isPublic} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookViewListMobile;
