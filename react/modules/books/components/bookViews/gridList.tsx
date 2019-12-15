import React, { SFC, CSSProperties, useContext, useMemo, useState, useLayoutEffect, useCallback, Fragment, memo, useRef } from "react";

import { AjaxButton } from "app/components/bootstrapButton";
import { LabelDisplay } from "app/components/labelDisplay";

import { AppContext } from "app/renderUI";
import { IBookDisplay, useBooks } from "../../booksState";
import { useCurrentSearch } from "../../booksSearchState";

import BookDetailsQuery from "graphQL/books/getBookDetails.graphql";
import { useQuery, buildQuery } from "micro-graphql-react";

import uiStyles from "./uiStyles.module.css";
import gridStyles from "./gridList.module.css";
import { getCrossOriginAttribute } from "util/corsHelpers";
import { CoverSmall } from "app/components/bookCoverComponent";
import { QueryOf, Queries } from "graphql-typings";
import { setBooksSort } from "modules/books/setBookFilters";

const { bookTitle, bookAuthor } = uiStyles;
const { gridHoverFilter, detailsRow } = gridStyles;

interface ILocalProps {
  book: IBookDisplay;
  editBooksSubjects: any;
  editBooksTags: any;
  index: number;
  editBook: any;
  setRead: any;
  booksUiState: any;
  dispatchBooksUiState: any;
  runDelete: any;
}

const BookRow: SFC<ILocalProps> = props => {
  const [{ isPublic: viewingPublic, online }] = useContext(AppContext);
  const { book, index, booksUiState, dispatchBooksUiState, setRead, runDelete } = props;
  const { _id } = book;
  const { selectedBooks, savingReadForBooks: savingRead, pendingDelete, deleting } = booksUiState;

  const [expanded, setExpanded] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const hoverOverride = { display: pendingDelete[_id] ? "inline" : "" };

  return (
    <>
      <tr>
        {!viewingPublic && online ? (
          <td>
            <a style={{ fontSize: "12pt" }} onClick={() => dispatchBooksUiState(["toggle-select", _id])}>
              <i className={"fal " + (!!selectedBooks[_id] ? "fa-check-square" : "fa-square")} />
            </a>
          </td>
        ) : null}
        <td>
          <div style={{ minWidth: "75px", minHeight: "75px" }}>
            <CoverSmall url={book.smallImage} />
          </div>
        </td>
        <td>
          <div className={bookTitle}>{book.title}</div>
          {book.authors ? <div className={bookAuthor}>{book.authors.join(", ")}</div> : null}

          <div style={{ display: "flex", flexDirection: "row", marginTop: "3px", alignItems: "center", minHeight: "25px" }}>
            {online ? (
              detailsLoading ? (
                <a style={hoverOverride} target="_new" className={`margin-right ${gridHoverFilter}`}>
                  <i className="fa fa-fw fa-spin fa-spinner" />
                </a>
              ) : expanded ? (
                <a style={hoverOverride} target="_new" onClick={() => setExpanded(false)} className={`margin-right ${gridHoverFilter}`}>
                  <i className={`far fa-minus`} />
                </a>
              ) : (
                <a style={hoverOverride} target="_new" onClick={() => setExpanded(true)} className={`margin-right ${gridHoverFilter}`}>
                  <i className={`far fa-plus`} />
                </a>
              )
            ) : null}
            {book.isbn && online ? (
              <a
                style={hoverOverride}
                target="_new"
                className={`margin-right ${gridHoverFilter}`}
                href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
              >
                <i className={`fab fa-amazon`} />
              </a>
            ) : null}
            {!viewingPublic && online ? (
              <>
                <a style={hoverOverride} className={`margin-right ${gridHoverFilter}`} onClick={() => props.editBook(book)}>
                  <i className={`fal fa-pencil-alt`} />
                </a>
                <a style={hoverOverride} className={`margin-right ${gridHoverFilter}`} onClick={() => dispatchBooksUiState(["start-delete", _id])}>
                  <i className={`fal fa-trash-alt`} />
                </a>
              </>
            ) : null}
            {pendingDelete[_id] ? (
              <AjaxButton
                running={deleting[_id]}
                runningText="Deleting"
                onClick={() => runDelete(_id)}
                className="btn btn-xs btn-danger margin-right"
              >
                Confirm delete
              </AjaxButton>
            ) : null}
            {pendingDelete[_id] ? (
              <button onClick={() => dispatchBooksUiState(["cancel-delete", _id])} className="btn btn-xs">
                Cancel
              </button>
            ) : null}
          </div>
        </td>
        <td>
          <div style={{ marginTop: "3px" }}>
            {book.subjectObjects.map((s, i) => (
              <div key={i} style={{ marginBottom: "4px" }}>
                <LabelDisplay item={s} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 5 }}>
            {!viewingPublic ? (
              <a className={`margin-right ${gridHoverFilter}`} onClick={() => props.editBooksSubjects(book)}>
                <i className={`fal fa-pencil-alt`} />
              </a>
            ) : null}
          </div>
        </td>
        <td>
          <div style={{ marginTop: "3px" }}>
            {book.tagObjects.map((s, i) => (
              <div key={i} style={{ marginBottom: "4px" }}>
                <LabelDisplay item={s} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 5 }}>
            {!viewingPublic ? (
              <a className={`margin-right ${gridHoverFilter}`} onClick={() => props.editBooksTags(book)}>
                <i className={`fal fa-pencil-alt`} />
              </a>
            ) : null}
          </div>
        </td>
        <td>
          <div style={{ marginTop: !viewingPublic ? "3px" : 0 }}>
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
      {expanded ? <BookRowDetails {...{ book, index, setDetailsLoading }} /> : null}
    </>
  );
};

const BookRowDetails: SFC<{ book?: IBookDisplay; index?: number; setDetailsLoading: any }> = props => {
  let [{ isPublic: viewingPublic }] = useContext(AppContext);
  let { book, index, setDetailsLoading } = props;
  let backgroundColor = index % 2 ? "white" : "#f9f9f9";

  let [{ publicUserId }] = useContext(AppContext);

  let { loading, data } = useQuery<QueryOf<Queries["getBook"]>>(buildQuery(BookDetailsQuery, { _id: book._id, publicUserId, cache: 9 }));

  setDetailsLoading(loading);
  if (loading) {
    return null;
  }

  let editorialReviews, similarBooks;
  if (data) {
    ({ editorialReviews, similarBooks } = data.getBook.Book);
  }

  return (
    <tr key={"details" + book._id} style={{ backgroundColor }}>
      <td colSpan={viewingPublic ? 8 : 9} style={{ borderTop: 0, paddingLeft: "50px", paddingTop: 0, paddingBottom: "15px" }}>
        <div className={`row ${detailsRow}`}>
          <div style={{ position: "static" }} className="col-xs-6">
            {!editorialReviews || !editorialReviews.length ? (
              <h4 style={{ marginTop: 0, marginBottom: 0 }}>No editorial reviews for this book</h4>
            ) : (
              <div>
                {editorialReviews.map((review, index) => (
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
            {!similarBooks || !similarBooks.length ? (
              <h4 style={{ marginTop: 0, marginBottom: 0 }}>No similar items found for this book</h4>
            ) : (
              <div>
                <h4>Similar Books</h4>
                <table className="table table-condensed" style={{ backgroundColor: "transparent" }}>
                  <tbody>
                    {similarBooks.map((book, i) => (
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
  runDelete: any;
  booksUiState: any;
  dispatchBooksUiState: any;
};

const useBookSelection = (books, selectedBooks) => {
  return useMemo(() => {
    let selectedIds = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]).length;
    return {
      allAreChecked: books.length == selectedIds,
      selectedBooksCount: selectedIds,
      selectedBookHash: selectedBooks
    };
  }, [books, selectedBooks]);
};

const BookViewListGrid: SFC<BookViewListGridTypes> = props => {
  const { editBooksSubjects, editBooksTags, editBook, booksUiState, dispatchBooksUiState, setRead, runDelete } = props;
  const { selectedBooks } = booksUiState;

  const { books } = useBooks();
  const { allAreChecked } = useBookSelection(books, selectedBooks);
  const [{ isPublic: viewingPublic, online }] = useContext(AppContext);
  const { sort: currentSort, sortDirection } = useCurrentSearch();

  const toggleCheckAll = () => {
    dispatchBooksUiState([allAreChecked ? "de-select" : "select", books.map(b => b._id)]);
  };

  const setSort = column => {
    let newDirection = "asc";
    if (currentSort === column) {
      newDirection = sortDirection == "asc" ? "desc" : "asc";
    }

    setBooksSort(column, newDirection);
  };

  const potentialSortIcon = <i className={"fa fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />;
  const sortIconIf = column => (column == currentSort ? potentialSortIcon : null);

  const stickyHeaderStyle: CSSProperties = { position: "sticky", top: 0, backgroundColor: "white" };

  return (
    <div style={{ minHeight: 400 }}>
      {books.length ? (
        <div>
          <table style={{ position: "relative" }} className="table no-padding-top">
            <thead>
              <tr>
                {!viewingPublic && online ? (
                  <th style={{ ...stickyHeaderStyle, textAlign: "center" }}>
                    <a style={{ fontSize: "12pt" }} onClick={toggleCheckAll}>
                      <i className={"fal " + (!!allAreChecked ? "fa-check-square" : "fa-square")} />
                    </a>
                  </th>
                ) : null}
                <th style={{ ...stickyHeaderStyle }} />
                <th style={{ ...stickyHeaderStyle, minWidth: "200px" }}>
                  <a className="no-underline" onClick={() => setSort("title")}>
                    Title {sortIconIf("title")}
                  </a>
                </th>
                <th style={{ minWidth: "90px", ...stickyHeaderStyle }}>Subjects</th>
                <th style={{ minWidth: "90px", ...stickyHeaderStyle }}>Tags</th>
                <th style={{ minWidth: "90px", ...stickyHeaderStyle }} />
                <th style={{ ...stickyHeaderStyle }} />
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
              {books.map((book, index) => (
                <BookRow
                  key={book._id}
                  editBooksSubjects={editBooksSubjects}
                  editBooksTags={editBooksTags}
                  {...{ book, editBook, index, online, setRead, booksUiState, dispatchBooksUiState, runDelete }}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default BookViewListGrid;
