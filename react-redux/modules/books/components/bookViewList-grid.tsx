import React, { SFC, CSSProperties, useContext, useMemo, useState, useLayoutEffect, useCallback, Fragment, memo, useRef } from "react";

import { AjaxButton } from "applicationRoot/components/bootstrapButton";
import { LabelDisplay } from "applicationRoot/components/labelDisplay";

import { AppContext } from "applicationRoot/renderUI";
import { useBookList, IBookDisplay, BooksContext } from "../booksState";
import { useCurrentSearch } from "../booksSearchState";

import DeleteBookMutation from "graphQL/books/deleteBook.graphql";
import { useMutation, buildMutation } from "micro-graphql-react";

interface ILocalProps {
  book: IBookDisplay;
  editBooksSubjects: any;
  editBooksTags: any;
  index: number;
  editBook: any;
  online: any;
  setRead: any;
  booksUiState: any;
  dispatchBooksUiState: any;
  deleteBook: any;
}

const BookRow: SFC<ILocalProps> = props => {
  const [{ isPublic: viewingPublic, publicUserId, online }] = useContext(AppContext);
  const { book, index, booksUiState, dispatchBooksUiState, setRead, deleteBook } = props;
  const { _id } = book;
  const { selectedBooks, savingReadForBooks: savingRead, pendingDelete } = booksUiState;

  const { collapseBook, expandBook } = {} as any;
  const style: any = { backgroundColor: index % 2 ? "white" : "#f9f9f9" };

  useLayoutEffect(() => {}, [book]);

  return (
    <tr style={style}>
      {!viewingPublic && online ? (
        <td>
          <a style={{ fontSize: "12pt" }} onClick={() => dispatchBooksUiState(["toggle-select", _id])}>
            <i className={"fal " + (!!selectedBooks[_id] ? "fa-check-square" : "fa-square")} />
          </a>
        </td>
      ) : null}
      <td>
        <div style={{ minWidth: "75px", minHeight: "75px" }}>
          <img crossOrigin="anonymous" src={book.smallImage} />
        </div>
      </td>
      <td>
        <div style={{ fontWeight: "bold" }}>{book.title}</div>
        {book.authors ? <div style={{ fontStyle: "italic" }}>{book.authors.join(", ")}</div> : null}

        {online ? (
          book.detailsLoading ? (
            <a target="_new" className="margin-right grid-hover-filter inline-filter">
              <i style={{ display: pendingDelete[_id] ? "inline" : "" }} className="fa fa-fw fa-spin fa-spinner" />
            </a>
          ) : book.expanded ? (
            <a target="_new" onClick={() => collapseBook(_id)} className="margin-right grid-hover-filter inline-filter">
              <i style={{ display: pendingDelete[_id] ? "inline" : "" }} className="far fa-minus show-on-hover-parent-td" />
            </a>
          ) : (
            <a target="_new" onClick={() => expandBook(_id, publicUserId)} className="margin-right grid-hover-filter inline-filter">
              <i style={{ display: pendingDelete[_id] ? "inline" : "" }} className="far fa-plus show-on-hover-parent-td" />
            </a>
          )
        ) : null}
        {book.isbn && online ? (
          <a
            target="_new"
            className="margin-right grid-hover-filter inline-filter"
            href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
          >
            <i style={{ display: pendingDelete[_id] ? "inline" : "" }} className="fab fa-amazon show-on-hover-parent-td" />
          </a>
        ) : null}
        {!viewingPublic && online ? (
          <>
            <a className="margin-right grid-hover-filter inline-filter" onClick={() => props.editBook(book)}>
              <i style={{ display: pendingDelete[_id] ? "inline" : "" }} className="fal fa-pencil-alt show-on-hover-parent-td" />
            </a>
            <a className="margin-right grid-hover-filter inline-filter" onClick={() => dispatchBooksUiState(["start-delete", _id])}>
              <i style={{ display: pendingDelete[_id] ? "inline" : "" }} className="fal fa-trash-alt show-on-hover-parent-td" />
            </a>
          </>
        ) : null}
        {pendingDelete[_id] ? (
          <AjaxButton running={0} runningText="Deleting" onClick={() => deleteBook({ _id })} className="btn btn-xs btn-danger margin-right">
            Confirm delete
          </AjaxButton>
        ) : null}
        {pendingDelete[_id] ? (
          <button onClick={() => dispatchBooksUiState(["cancel-delete", _id])} className="btn btn-xs btn-primary">
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
            <a className="margin-right grid-hover-filter inline-filter" onClick={() => props.editBooksSubjects(book)}>
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
            <a className="margin-right grid-hover-filter inline-filter" onClick={() => props.editBooksTags(book)}>
              <i className="fal fa-pencil-alt show-on-hover-parent-td" />
            </a>
          ) : null}
        </div>
      </td>
      <td>
        <div style={{ marginTop: !viewingPublic ? 5 : 0 }}>
          {!viewingPublic ? (
            !!book.isRead ? (
              <AjaxButton runningText=" " running={!!savingRead[_id]} onClick={() => setRead([_id], !book.isRead)} preset="success-xs">
                Read <i className="fa fa-fw fa-check" />
              </AjaxButton>
            ) : (
              <AjaxButton runningText=" " running={!!savingRead[_id]} onClick={() => setRead([_id], !book.isRead)} preset="default-xs">
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
};

const BookRowDetails: SFC<{ book?: IBookDisplay; index?: number }> = props => {
  let [{ isPublic: viewingPublic }] = useContext(AppContext);
  let { book, index } = props;
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
};

type BookViewListGridTypes = {
  editBooksSubjects: any;
  editBooksTags: any;
  editBook: any;
  setRead: any;
  booksUiState: any;
  dispatchBooksUiState: any;
};

const useBookSelection = (booksHash, selectedBooks) => {
  return useMemo(() => {
    let selectedIds = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]).length;
    return {
      allAreChecked: Object.keys(booksHash).length == selectedIds,
      selectedBooksCount: selectedIds,
      selectedBookHash: selectedBooks
    };
  }, [booksHash, selectedBooks]);
};

const BookViewListGrid: SFC<BookViewListGridTypes> = props => {
  const { editBooksSubjects, editBooksTags, editBook, booksUiState, dispatchBooksUiState, setRead } = props;
  const { selectedBooks } = booksUiState;

  const { setSortOrder } = {} as any;
  const { booksHash } = useContext(BooksContext);
  const { booksList } = useBookList();
  const { allAreChecked } = useBookSelection(booksHash, selectedBooks);
  const [{ isPublic: viewingPublic, online }] = useContext(AppContext);
  const { sort: currentSort, sortDirection } = useCurrentSearch();
  const { runMutation: deleteBook } = useMutation(buildMutation(DeleteBookMutation));

  const toggleCheckAll = () => {
    dispatchBooksUiState([allAreChecked ? "de-select" : "select", Object.keys(booksHash)]);
  };

  const setSort = column => {
    let newDirection = "asc";
    if (currentSort === column) {
      newDirection = sortDirection == "asc" ? "desc" : "asc";
    }

    setSortOrder(column, newDirection);
  };

  const potentialSortIcon = <i className={"fa fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />;
  const sortIconIf = column => (column == currentSort ? potentialSortIcon : null);

  const stickyHeaderStyle: CSSProperties = { position: "sticky", top: 0, backgroundColor: "white" };

  return (
    <div style={{ minHeight: 400 }}>
      {booksList.length ? (
        <div>
          <table style={{ position: "relative" }} className="table no-padding-top">
            <thead>
              <tr>
                {!viewingPublic && online ? (
                  <th style={{ ...stickyHeaderStyle }}>
                    <a style={{ fontSize: "12pt" }} onClick={toggleCheckAll}>
                      <i className={"fal " + (!!allAreChecked ? "fa-check-square" : "fa-square")} />
                    </a>
                  </th>
                ) : null}
                <th style={{ ...stickyHeaderStyle }} />
                <th style={{ ...stickyHeaderStyle }}>
                  <a className="no-underline" onClick={() => setSort("title")}>
                    Title {sortIconIf("title")}
                  </a>
                </th>
                <th style={{ ...stickyHeaderStyle }}>Subjects</th>
                <th style={{ ...stickyHeaderStyle }}>Tags</th>
                <th style={{ minWidth: "90px", ...stickyHeaderStyle }}>Read?</th>
                <th style={{ ...stickyHeaderStyle }}>Published / ISBN</th>
                <th style={{ minWidth: "85px", ...stickyHeaderStyle }}>
                  <a className="no-underline" onClick={() => setSort("pages")}>
                    Pages {sortIconIf("pages")}
                  </a>
                </th>
                <th style={{ ...stickyHeaderStyle }}>
                  <a className="no-underline" onClick={() => setSort("_id")}>
                    Added {sortIconIf("_id")}
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              {booksList.map((book, index) => (
                <Fragment key={book._id}>
                  <BookRow
                    editBooksSubjects={editBooksSubjects}
                    editBooksTags={editBooksTags}
                    {...{ book, editBook, index, online, setRead, booksUiState, dispatchBooksUiState, deleteBook }}
                  />
                  {book.expanded ? <BookRowDetails book={book} index={index} /> : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default BookViewListGrid;
