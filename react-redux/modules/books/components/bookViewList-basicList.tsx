import React, { SFC, useContext } from "react";
import { AjaxButton } from "applicationRoot/components/bootstrapButton";
import { AppContext } from "applicationRoot/renderUI";
import { BooksContext } from "../booksState";

const BookViewListMobileItem = props => {
  const { book, online, booksUiState, dispatchBooksUiState } = props;
  const { pendingDelete, deleting } = booksUiState;

  let publisherDisplay = null;
  let isbnPages = null;

  if (book.publisher || book.publicationDate) {
    publisherDisplay = [book.publisher, book.publicationDate].filter(s => s).join(" ");
  }
  if (book.isbn || book.pages) {
    isbnPages = [book.pages ? `${book.pages} pages` : null, book.isbn ? `ISBN ${book.isbn}` : null].filter(o => o).join("; ");
  }

  return (
    <div className="list-group-item" style={{ cursor: "pointer" }}>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "5px", minWidth: "55px" }}>
          <img src={book.smallImage} />
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div className="list-group-item-heading book-title">{book.title}</div>
            <span className="list-group-item-text book-author">{book.authors.length ? book.authors.join(", ") : ""}</span>
            <div style={{ marginTop: "auto", marginBottom: "5px" }}>
              {!props.viewingPublic && online ? (
                <>
                  <button className="btn btn-xs no-border btn-light" onClick={() => props.editBook(book)}>
                    <i className="fa fa-fw fa-pencil" />
                  </button>
                  <button className="btn btn-xs no-border btn-light" onClick={() => dispatchBooksUiState(["start-delete", [book._id]])}>
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
        <div style={{ border: 0 }} className="list-group docked-to-panel">
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
