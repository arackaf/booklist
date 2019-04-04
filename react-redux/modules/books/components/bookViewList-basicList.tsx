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
        <div style={{ marginTop: "5px", marginRight: "15px", minWidth: "60px" }}>
          <img src={book.smallImage} />
        </div>
        <div>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h4 className="list-group-item-heading">{book.title}</h4>
            <p className="list-group-item-text">{book.authors.length ? <b>{book.authors.join(", ")}</b> : "No author"}</p>
            <div style={{ marginTop: "auto", marginBottom: "5px" }}>
              {!props.viewingPublic && online ? (
                <>
                  <button className="btn btn-primary btn-xs" onClick={() => props.editBook(book)}>
                    <i className="fa fa-fw fa-pencil" />
                  </button>
                  <button className="margin-left btn btn-danger btn-xs" onClick={() => dispatchBooksUiState(["start-delete", [book._id]])}>
                    <i className="fa fa-fw fa-trash" />
                  </button>
                </>
              ) : null}
              {pendingDelete[book._id] ? (
                <AjaxButton
                  running={deleting[book._id]}
                  runningText="Deleting"
                  onClick={() => props.runDelete(book._id)}
                  className="margin-left btn btn-xs btn-danger"
                >
                  Confirm delete
                </AjaxButton>
              ) : null}
              {pendingDelete[book._id] ? (
                <button onClick={() => dispatchBooksUiState(["cancel-delete", [book._id]])} className="margin-left btn btn-xs btn-primary">
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
