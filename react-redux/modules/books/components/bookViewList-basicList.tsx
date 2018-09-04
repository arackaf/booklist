import React, { Component } from "react";
import { connect } from "react-redux";
import BootstrapButton, { AjaxButton } from "applicationRoot/components/bootstrapButton";
import { selectBookListComponentState, actions, actionsType } from "./sharedSelectors/bookListComponentSelectors";

@connect(
  null,
  actions
)
class BookViewListMobileItem extends Component<any, any> {
  render() {
    let props = this.props,
      book = props.book;

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
            <img src={book.smallImage} />
          </div>
          <div className="col-xs-9 col-sm-11">
            <h4 className="list-group-item-heading">{book.title}</h4>
            <p className="list-group-item-text">{book.authors.length ? <b>{book.authors.join(", ")}</b> : "No author"}</p>
            <div>
              {publisherDisplay ? <p className="list-group-item-text">{publisherDisplay}</p> : null}
              {isbnPages ? <p className="list-group-item-text">{isbnPages}</p> : null}

              {!props.viewingPublic ? (
                <button className="btn btn-primary btn-xs" onClick={() => props.editBook(book)}>
                  <i className="fa fa-fw fa-pencil" />
                </button>
              ) : null}
              {!props.viewingPublic ? (
                <button className="margin-left btn btn-danger btn-xs" onClick={() => props.setPendingDeleteBook(book)}>
                  <i className="fa fa-fw fa-trash" />
                </button>
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
  }
}

@connect(
  selectBookListComponentState,
  actions
)
export default class BookViewListMobile extends Component<ReturnType<typeof selectBookListComponentState> & { editBook: any } & actionsType, any> {
  render() {
    let props = this.props;
    return (
      <div>
        <div style={{ paddingBottom: 15 }}>
          <div style={{ border: 0 }} className="list-group docked-to-panel">
            {props.booksList.map((book, i) => (
              <BookViewListMobileItem key={book._id} book={book} editBook={this.props.editBook} viewingPublic={props.viewingPublic} />
            ))}
          </div>
        </div>

        {props.currentPage > 1 || props.hasMoreBooks ? (
          <div style={{ marginLeft: "10px", marginTop: "10px", marginBottom: "10px" }}>
            {props.currentPage > 1 ? (
              <BootstrapButton style={{ marginRight: "10px" }} preset="primary-xs" onClick={props.pageDown}>
                <i className="fa fa-fw fa-chevron-left" /> Previous
              </BootstrapButton>
            ) : null}
            {props.hasMoreBooks ? (
              <BootstrapButton preset="primary-xs" onClick={props.pageUp}>
                Next <i className="fa fa-fw fa-chevron-right" />
              </BootstrapButton>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}
