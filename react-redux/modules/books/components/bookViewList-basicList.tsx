import React, { SFC } from "react";
import { connect } from "react-redux";
import { AjaxButton } from "applicationRoot/components/bootstrapButton";
import { selectBookListComponentState, actions, actionsType } from "./sharedSelectors/bookListComponentSelectors";

const BookViewListMobileItem = props => {
  let { book, online } = props;

  let publisherDisplay = null,
    isbnPages = null;
  if (book.publisher || book.publicationDate) {
    publisherDisplay = [book.publisher, book.publicationDate].filter(s => s).join(" ");
  }
  if (book.isbn || book.pages) {
    isbnPages = [book.pages ? `${book.pages} pages` : null, book.isbn ? `ISBN ${book.isbn}` : null].filter(o => o).join("; ");
  }

  return (
    <span className="list-group-item" style={{ cursor: "pointer" }}>
      <div className="row">
        <div className="col-xs-3 col-sm-1">
          <img crossOrigin="anonymous" src={book.smallImage} />
        </div>
        <div className="col-xs-9 col-sm-11">
          <h4 className="list-group-item-heading">{book.title}</h4>
          <p className="list-group-item-text">{book.authors.length ? <b>{book.authors.join(", ")}</b> : "No author"}</p>
          <div>
            {publisherDisplay ? <p className="list-group-item-text">{publisherDisplay}</p> : null}
            {isbnPages ? <p className="list-group-item-text">{isbnPages}</p> : null}

            {!props.viewingPublic && online ? (
              <>
                <button className="btn btn-primary btn-xs" onClick={() => props.editBook(book)}>
                  <i className="fa fa-fw fa-pencil" />
                </button>
                <button className="margin-left btn btn-danger btn-xs" onClick={() => props.setPendingDeleteBook(book)}>
                  <i className="fa fa-fw fa-trash" />
                </button>
              </>
            ) : null}
            {book.pendingDelete ? (
              <AjaxButton
                running={book.deleting}
                runningText="Deleting"
                onClick={() => props.deleteBook(book)}
                className="margin-left btn btn-xs btn-danger"
              >
                Confirm delete
              </AjaxButton>
            ) : null}
            {book.pendingDelete ? (
              <button onClick={() => props.cancelPendingDeleteBook(book)} className="margin-left btn btn-xs btn-primary">
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </span>
  );
};

const BookViewListMobile: SFC<ReturnType<typeof selectBookListComponentState> & { editBook: any } & actionsType> = props => {
  return (
    <div>
      <div style={{ paddingBottom: 15 }}>
        <div style={{ border: 0 }} className="list-group docked-to-panel">
          {props.booksList.map((book, i) => (
            <BookViewListMobileItem online={props.online} key={book._id} book={book} editBook={props.editBook} viewingPublic={props.viewingPublic} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default connect(
  selectBookListComponentState,
  actions
)(BookViewListMobile);
