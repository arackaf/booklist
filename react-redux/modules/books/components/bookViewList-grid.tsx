import React, { Component, CSSProperties } from "react";
import { connect } from "react-redux";

import { AjaxButton } from "applicationRoot/components/bootstrapButton";
import { LabelDisplay } from "applicationRoot/components/labelDisplay";

import { IBookDisplay } from "modules/books/reducers/books/reducer";
import { selectBookListComponentState, actions, actionsType } from "./sharedSelectors/bookListComponentSelectors";

interface ILocalProps {
  book: IBookDisplay;
  editBooksSubjects: any;
  editBooksTags: any;
  index: number;
  viewingPublic: boolean;
  selectedBooks: any;
  editBook: any;
}

class BookRowRaw extends Component<ILocalProps & actionsType, any> {
  render() {
    let { book, index, viewingPublic } = this.props;
    let style: any = { backgroundColor: index % 2 ? "white" : "#f9f9f9" };

    return (
      <tr key={book._id} style={style}>
        {!viewingPublic ? (
          <td>
            <a style={{ fontSize: "12pt" }} onClick={() => this.props.toggleSelectBook(book._id)}>
              <i className={"fal " + (!!this.props.selectedBooks[book._id] ? "fa-check-square" : "fa-square")} />
            </a>
          </td>
        ) : null}
        <td>
          <div style={{ minWidth: "75px", minHeight: "75px" }}>
            <img src={book.smallImage} />
          </div>
        </td>
        <td>
          <div style={{ fontWeight: "bold" }}>{book.title}</div>
          {book.authors ? <div style={{ fontStyle: "italic" }}>{book.authors.join(", ")}</div> : null}

          {book.detailsLoading ? (
            <a target="_new" className="margin-right grid-hover-filter inline-filter">
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="fa fa-fw fa-spin fa-spinner" />
            </a>
          ) : book.expanded ? (
            <a target="_new" onClick={() => this.props.collapseBook(book._id)} className="margin-right grid-hover-filter inline-filter">
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="far fa-minus show-on-hover-parent-td" />
            </a>
          ) : (
            <a target="_new" onClick={() => this.props.expandBook(book._id)} className="margin-right grid-hover-filter inline-filter">
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="far fa-plus show-on-hover-parent-td" />
            </a>
          )}
          {book.isbn ? (
            <a
              target="_new"
              className="margin-right grid-hover-filter inline-filter"
              href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
            >
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="fab fa-amazon show-on-hover-parent-td" />
            </a>
          ) : null}
          {!viewingPublic ? (
            <a className="margin-right grid-hover-filter inline-filter" onClick={() => this.props.editBook(book)}>
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="fal fa-pencil-alt show-on-hover-parent-td" />
            </a>
          ) : null}
          {!viewingPublic ? (
            <a className="margin-right grid-hover-filter inline-filter" onClick={() => this.props.setPendingDeleteBook(book)}>
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="fal fa-trash-alt show-on-hover-parent-td" />
            </a>
          ) : null}
          {book.pendingDelete ? (
            <AjaxButton
              running={book.deleting}
              runningText="Deleting"
              onClick={() => this.props.deleteBook(book)}
              className="btn btn-xs btn-danger margin-right"
            >
              Confirm delete
            </AjaxButton>
          ) : null}
          {book.pendingDelete ? (
            <button onClick={() => this.props.cancelPendingDeleteBook(book)} className="btn btn-xs btn-primary">
              Cancel
            </button>
          ) : null}
        </td>
        <td>
          {book.subjectObjects.map((s, i) => (
            <div key={i}>
              <LabelDisplay item={s} />
            </div>
          ))}
          <div style={{ marginTop: 5, minHeight: 40 }}>
            {!viewingPublic ? (
              <a className="margin-right grid-hover-filter inline-filter" onClick={() => this.props.editBooksSubjects(book)}>
                <i className="fal fa-pencil-alt show-on-hover-parent-td" />
              </a>
            ) : null}
          </div>
        </td>
        <td>
          {book.tagObjects.map((s, i) => (
            <div key={i}>
              <LabelDisplay item={s} />
            </div>
          ))}
          <div style={{ marginTop: 5, minHeight: 40 }}>
            {!viewingPublic ? (
              <a className="margin-right grid-hover-filter inline-filter" onClick={() => this.props.editBooksTags(book)}>
                <i className="fal fa-pencil-alt show-on-hover-parent-td" />
              </a>
            ) : null}
          </div>
        </td>
        <td>
          <div style={{ marginTop: !viewingPublic ? 5 : 0 }}>
            {!viewingPublic ? (
              !!book.isRead ? (
                <AjaxButton running={!!book.readChanging} runningText=" " onClick={() => this.props.setUnRead(book._id)} preset="success-xs">
                  Read <i className="fa fa-fw fa-check" />
                </AjaxButton>
              ) : (
                <AjaxButton running={!!book.readChanging} runningText=" " onClick={() => this.props.setRead(book._id)} preset="default-xs">
                  Set read
                </AjaxButton>
              )
            ) : !!book.isRead ? (
              <span className="label label-success">
                Read <i className="fa fa-fw fa-check" />
              </span>
            ) : null}
          </div>
        </td>
        <td>
          {book.publisher ? <div>{book.publisher}</div> : null}
          {book.publicationDate ? <div>{book.publicationDate}</div> : null}
          {book.isbn ? <div>{book.isbn}</div> : null}
        </td>
        <td>{book.pages}</td>
        <td>{book.dateAddedDisplay}</td>
      </tr>
    );
  }
}
let BookRow: any = connect(
  null,
  actions
)(BookRowRaw);

class BookRowDetailsRaw extends Component<{ book: IBookDisplay; index: number; viewingPublic: boolean }, any> {
  render() {
    let { book, index, viewingPublic } = this.props;
    let backgroundColor = index % 2 ? "white" : "#f9f9f9";
    return (
      <tr key={"details" + book._id} style={{ backgroundColor }}>
        <td colSpan={viewingPublic ? 8 : 9} style={{ borderTop: 0, paddingLeft: "50px", paddingTop: 0, paddingBottom: "15px" }}>
          <div className="row">
            <div style={{ position: "static" }} className="col-xs-6">
              {!book.editorialReviews.length ? (
                <h4 style={{ marginTop: 0, marginBottom: 0 }}>No editorial reviews for this book</h4>
              ) : (
                <div>
                  {book.editorialReviews.map((review, index) => (
                    <div key={index}>
                      {index > 0 ? <hr style={{ border: "2px solid #eee" }} /> : null}
                      <h4>{review.source || "<unknown source>"}</h4>
                      <div dangerouslySetInnerHTML={{ __html: review.content }} />
                    </div>
                  ))}
                  <br />
                </div>
              )}
            </div>

            <div style={{ position: "static" }} className="col-xs-6">
              {!book.similarBooks.length ? (
                <h4 style={{ marginTop: 0, marginBottom: 0 }}>No similar items found for this book</h4>
              ) : (
                <div>
                  <h4>Similar Books</h4>
                  <table className="table table-condensed" style={{ backgroundColor: "transparent" }}>
                    <tbody>
                      {book.similarBooks.map((book, i) => (
                        <tr key={i}>
                          <td>{book.smallImage ? <img src={book.smallImage} /> : null}</td>
                          <td>
                            <span style={{ fontWeight: "bold" }}>{book.title}</span>
                            <br />
                            {book.authors.length ? (
                              <>
                                <span style={{ fontStyle: "italic" }}>{book.authors.join(", ")}</span>
                                <br />
                              </>
                            ) : null}
                            <a target="_new" style={{ color: "black" }} href={`https://www.amazon.com/gp/product/${book.asin}/?tag=zoomiec-20`}>
                              <i className="fab fa-amazon" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  }
}

const BookRowDetails = connect(
  null,
  null
)(BookRowDetailsRaw);

class BookViewListGrid extends Component<
  ReturnType<typeof selectBookListComponentState> & actionsType & { editBooksSubjects: any; editBooksTags: any; editBook: any },
  any
> {
  state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [], editingSubject: null };
  setSort(column) {
    let currentSort = this.props.currentSort;
    let newDirection = "asc";
    if (currentSort === column) {
      newDirection = this.props.sortDirection == "asc" ? "desc" : "asc";
    }

    this.props.setSortOrder(column, newDirection);
  }
  render() {
    let potentialSortIcon = <i className={"fa fa-angle-" + (this.props.sortDirection == "asc" ? "up" : "down")} />;
    let sortIconIf = column => (column == this.props.currentSort ? potentialSortIcon : null);

    let { editBooksSubjects, editBooksTags, viewingPublic } = this.props;
    let stickyHeaderStyle: CSSProperties = { position: "sticky", top: 0, backgroundColor: "white" };
    return (
      <div style={{ minHeight: 400 }}>
        {this.props.booksList.length ? (
          <div>
            <table style={{ position: "relative" }} className="table no-padding-top">
              <thead>
                <tr>
                  {!viewingPublic ? (
                    <th style={{ ...stickyHeaderStyle }}>
                      <a style={{ fontSize: "12pt" }} onClick={this.props.toggleCheckAll}>
                        <i className={"fal " + (!!this.props.allAreChecked ? "fa-check-square" : "fa-square")} />
                      </a>
                    </th>
                  ) : null}
                  <th style={{ ...stickyHeaderStyle }} />
                  <th style={{ ...stickyHeaderStyle }}>
                    <a className="no-underline" onClick={() => this.setSort("title")}>
                      Title {sortIconIf("title")}
                    </a>
                  </th>
                  <th style={{ ...stickyHeaderStyle }}>Subjects</th>
                  <th style={{ ...stickyHeaderStyle }}>Tags</th>
                  <th style={{ minWidth: "90px", ...stickyHeaderStyle }}>Read?</th>
                  <th style={{ ...stickyHeaderStyle }}>Published / ISBN</th>
                  <th style={{ minWidth: "85px", ...stickyHeaderStyle }}>
                    <a className="no-underline" onClick={() => this.setSort("pages")}>
                      Pages {sortIconIf("pages")}
                    </a>
                  </th>
                  <th style={{ ...stickyHeaderStyle }}>
                    <a className="no-underline" onClick={() => this.setSort("_id")}>
                      Added {sortIconIf("_id")}
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.booksList.map((book, index) => [
                  <BookRow
                    editBooksSubjects={editBooksSubjects}
                    editBooksTags={editBooksTags}
                    book={book}
                    editBook={this.props.editBook}
                    index={index}
                    viewingPublic={viewingPublic}
                    selectedBooks={this.props.selectedBooks}
                  />,
                  book.expanded ? <BookRowDetails book={book} index={index} viewingPublic={viewingPublic} /> : null
                ])}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    );
  }
}

export default connect(
  selectBookListComponentState,
  actions
)(BookViewListGrid);
