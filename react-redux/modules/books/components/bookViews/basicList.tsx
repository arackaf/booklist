import React, { SFC, useContext } from "react";
import { AjaxButton } from "applicationRoot/components/bootstrapButton";
import { AppContext } from "applicationRoot/renderUI";
import { BooksContext } from "../../booksState";

import uiStyles from "./uiStyles.module.css";
import basicListClasses from "./basicList.module.css";

const { bookTitle, bookAuthor } = uiStyles;
const { dockedToPanel, listGroup, listGroupItem, listGroupItemHeading, listGroupItemText } = basicListClasses;

const BookViewListMobileItem = props => {
  const { book, online, booksUiState, dispatchBooksUiState } = props;
  const { pendingDelete, deleting } = booksUiState;

  return (
    <div className={listGroupItem} style={{ cursor: "pointer" }}>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "5px", minWidth: "55px" }}>
          <img src={book.smallImage} crossOrigin="anonymous" />
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div className={`${listGroupItemHeading} ${bookTitle}`}>{book.title}</div>
            <span className={`${listGroupItemText} ${bookAuthor}`}>{book.authors.length ? book.authors.join(", ") : ""}</span>
            <div style={{ marginTop: "auto" }}>
              {!props.viewingPublic && online ? (
                <>
                  <button className="btn btn-xs btn-light btn-round-icon" onClick={() => props.editBook(book)}>
                    <i className="fa fa-fw fa-pencil" />
                  </button>
                  <button
                    style={{ marginLeft: "2px" }}
                    className="btn btn-xs btn-light btn-round-icon"
                    onClick={() => dispatchBooksUiState(["start-delete", [book._id]])}
                  >
                    <i className="fa fa-fw fa-trash" />
                  </button>
                </>
              ) : null}
              {pendingDelete[book._id] ? (
                <AjaxButton
                  running={deleting[book._id]}
                  runningText="Deleting"
                  onClick={() => props.runDelete(book._id)}
                  className="margin-left btn btn-xxs btn-danger"
                >
                  Confirm Delete
                </AjaxButton>
              ) : null}
              {pendingDelete[book._id] ? (
                <button onClick={() => dispatchBooksUiState(["cancel-delete", [book._id]])} className="margin-left btn btn-xxs">
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

const BookViewListMobile: SFC<{ editBook: any; booksUiState: any; dispatchBooksUiState: any; runDelete: any }> = props => {
  const { books } = useContext(BooksContext);
  const [{ online, isPublic }] = useContext(AppContext);
  const { booksUiState, dispatchBooksUiState, editBook, runDelete } = props;

  return (
    <div>
      <div style={{ paddingBottom: 15 }}>
        <div style={{ border: 0 }} className={`${listGroup} ${dockedToPanel}`}>
          {books.map((book, i) => (
            <BookViewListMobileItem
              key={book._id}
              {...{ book, editBook, booksUiState, dispatchBooksUiState, online, runDelete }}
              viewingPublic={isPublic}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookViewListMobile;
