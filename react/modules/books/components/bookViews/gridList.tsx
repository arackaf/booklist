import React, { CSSProperties, useContext, useMemo, useState, FunctionComponent } from "react";

import { ActionButton } from "app/components/ui/Button";
import { LabelDisplay } from "app/components/subjectsAndTags/LabelDisplay";

import { AppContext } from "app/state/appState";
import { IBookDisplay } from "../../booksState";
import { useCurrentSearch } from "../../booksSearchState";

import BookDetailsQuery from "gql/books/getBookDetails.graphql";
import { useQuery } from "micro-graphql-react";

import { CoverSmall } from "app/components/bookCoverComponent";
import { QueryOf, Queries } from "gql/graphql-typings";
import { setBooksSort, addFilterSubject, addFilterTag } from "modules/books/setBookFilters";
import { BooksModuleContext } from "modules/books/booksState";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";
import FlowItems from "app/components/layout/FlowItems";
import useDelete from "app/helpers/useDelete";

import "./uiStyles.scss";
import "./gridList.scss";

interface ILocalProps {
  book: IBookDisplay;
  editBooksSubjects: any;
  editBooksTags: any;
  editBook: any;
  setRead: any;
  booksUiState: any;
  dispatchBooksUiState: any;
  runDelete: any;
}

const BookRow: FunctionComponent<ILocalProps> = props => {
  const [{ isPublic: viewingPublic, online }] = useContext(AppContext);
  const { book, booksUiState, dispatchBooksUiState, setRead, runDelete } = props;
  const { _id } = book;
  const { selectedBooks } = booksUiState;

  const [expanded, setExpanded] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [startDelete, cancelDelete, doDelete, pendingDelete, deleting] = useDelete(() => runDelete(_id));

  const hoverOverride = { display: pendingDelete ? "inline" : "" };

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
          <div style={{ width: "60px", minHeight: "75px" }}>
            <CoverSmall preview={book.smallImagePreview} url={book.smallImage} />
          </div>
        </td>
        <td>
          <Stack>
            <Stack tightest={true}>
              <div className="book-title">{book.title}</div>
              {book.authors ? <div className="book-author">{book.authors.join(", ")}</div> : null}
            </Stack>

            <FlowItems vCenter={true} tighter={true} containerStyle={{ minHeight: "35px" }}>
              {online ? (
                detailsLoading ? (
                  <a style={hoverOverride} target="_new" className="grid-hover-filter">
                    <i className="far fa-fw fa-spin fa-spinner" />
                  </a>
                ) : expanded ? (
                  <a style={hoverOverride} target="_new" onClick={() => setExpanded(false)} className="grid-hover-filter">
                    <i className={`far fa-minus`} />
                  </a>
                ) : (
                  <a style={hoverOverride} target="_new" onClick={() => setExpanded(true)} className="grid-hover-filter">
                    <i className={`far fa-plus`} />
                  </a>
                )
              ) : null}
              {book.isbn && online ? (
                <a
                  style={{ ...hoverOverride, paddingTop: "1px" }}
                  target="_new"
                  className="grid-hover-filter"
                  href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
                >
                  <i className={`fab fa-amazon`} />
                </a>
              ) : null}
              {!viewingPublic && online ? (
                <>
                  <a style={hoverOverride} className="grid-hover-filter" onClick={() => props.editBook(book)}>
                    <i className="fal fa-pencil-alt"></i>
                  </a>
                  <a style={hoverOverride} className="grid-hover-filter" onClick={startDelete}>
                    <i className={`fal fa-trash-alt`} />
                  </a>
                </>
              ) : null}
              {pendingDelete ? (
                <ActionButton text="Confirm Delete" runningText="Deleting" onClick={doDelete} preset="danger-xs">
                  Confirm Delete
                </ActionButton>
              ) : null}
              {pendingDelete ? (
                <button disabled={deleting} onClick={cancelDelete} className="btn btn-xs">
                  Cancel
                </button>
              ) : null}
            </FlowItems>
          </Stack>
        </td>
        <td>
          <div style={{ marginTop: "3px" }}>
            {book.subjectObjects.map((s, i) => (
              <div key={i} style={{ marginBottom: "4px" }}>
                <LabelDisplay onClick={() => addFilterSubject(s._id)} item={s} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 5 }}>
            {!viewingPublic ? (
              <a className="grid-hover-filter" onClick={() => props.editBooksSubjects(book)}>
                <i className="fal fa-pencil-alt"></i>
              </a>
            ) : null}
          </div>
        </td>
        <td>
          <div style={{ marginTop: "3px" }}>
            {book.tagObjects.map((s, i) => (
              <div key={i} style={{ marginBottom: "4px" }}>
                <LabelDisplay onClick={t => addFilterTag(t._id)} item={s} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 5 }}>
            {!viewingPublic ? (
              <a className="grid-hover-filter" onClick={() => props.editBooksTags(book)}>
                <i className="fal fa-pencil-alt"></i>
              </a>
            ) : null}
          </div>
        </td>
        <td>
          <div style={{ marginTop: !viewingPublic ? "3px" : 0 }}>
            {!viewingPublic ? (
              !!book.isRead ? (
                <ActionButton
                  baseWidth="10ch"
                  text="Read"
                  runningText="Saving"
                  icon="far fa-fw fa-check"
                  onClick={() => setRead([_id], !book.isRead)}
                  preset="success-xs"
                />
              ) : (
                <ActionButton
                  baseWidth="10ch"
                  text="Set read"
                  runningText="Saving"
                  onClick={() => setRead([_id], !book.isRead)}
                  preset="default-xs"
                />
              )
            ) : !!book.isRead ? (
              <span className="label label-success">
                Read <i className="far fa-fw fa-check" />
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
      {expanded ? <BookRowDetails {...{ book, setDetailsLoading }} /> : null}
    </>
  );
};

const BookRowDetails: FunctionComponent<{ book?: IBookDisplay; setDetailsLoading: any }> = props => {
  let [{ isPublic: viewingPublic }] = useContext(AppContext);
  let { book, setDetailsLoading } = props;

  let [{ publicUserId }] = useContext(AppContext);

  let { loading, data } = useQuery<QueryOf<Queries["getBook"]>>(BookDetailsQuery, { _id: book._id, publicUserId });

  setDetailsLoading(loading);
  if (loading) {
    return null;
  }

  let editorialReviews, similarBooks;
  if (data) {
    ({ editorialReviews, similarBooks } = data.getBook.Book);
  }

  return (
    <tr key={"details" + book._id}>
      <td colSpan={viewingPublic ? 8 : 9} style={{ borderTop: 0, paddingLeft: "50px", paddingTop: 0, paddingBottom: "15px" }}>
        <FlexRow className="details-row">
          <div className="col-xs-6">
            {!editorialReviews || !editorialReviews.length ? (
              <h4>No editorial reviews for this book</h4>
            ) : (
              <div>
                {editorialReviews.map((review, index) => (
                  <div key={index}>
                    {index > 0 ? <hr style={{ border: "2px solid #eee" }} /> : null}
                    <Stack>
                      <h4>{review.source || "<unknown source>"}</h4>
                      <div dangerouslySetInnerHTML={{ __html: review.content }} />
                    </Stack>
                  </div>
                ))}
                <br />
              </div>
            )}
          </div>

          <div className="col-xs-6">
            {!similarBooks || !similarBooks.length ? (
              <h4>No similar items found for this book</h4>
            ) : (
              <div>
                <Stack>
                  <h4>Similar Books</h4>
                  <table className="table table-condensed" style={{ backgroundColor: "transparent" }}>
                    <tbody>
                      {similarBooks.map((book, i) => (
                        <tr key={i}>
                          <td>{book.smallImage ? <CoverSmall url={book.smallImage} /> : null}</td>
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
                </Stack>
              </div>
            )}
          </div>
        </FlexRow>
      </td>
    </tr>
  );
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

const BookViewListGrid: FunctionComponent<{ books: any; menuBarHeight: any }> = ({ books, menuBarHeight }) => {
  const { actions, booksUiState, dispatchBooksUiState } = useContext(BooksModuleContext);
  const { setRead, runDelete } = actions;

  const { editBook, openBookSubModal, openBookTagModal } = actions;
  const { selectedBooks } = booksUiState;

  const { allAreChecked } = useBookSelection(books, selectedBooks);
  const [{ isPublic: viewingPublic, online }] = useContext(AppContext);
  const { sort: currentSort, sortDirection } = useCurrentSearch();

  const editSubjectsForBook = book => openBookSubModal([book]);
  const editTagsForBook = book => openBookTagModal([book]);

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

  const potentialSortIcon = <i className={"far fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />;
  const sortIconIf = column => (column == currentSort ? potentialSortIcon : null);

  const stickyHeaderStyle: CSSProperties = {
    paddingTop: "2px",
    position: "sticky",
    top: `${menuBarHeight - 4}px`,
    backgroundColor: "white",
    zIndex: 2
  };

  return (
    <div className="book-display-grid-list" style={{ minHeight: 400 }}>
      {books.length ? (
        <div>
          <table style={{ position: "relative" }} className="table no-padding-top">
            <thead>
              <tr>
                {!viewingPublic && online ? (
                  <th style={{ ...stickyHeaderStyle, textAlign: "center", width: "25px" }}>
                    <a style={{ fontSize: "12pt" }} onClick={toggleCheckAll}>
                      <i className={"fal " + (!!allAreChecked ? "fa-check-square" : "fa-square")} />
                    </a>
                  </th>
                ) : null}
                <th style={{ ...stickyHeaderStyle, width: "60px" }} />
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
              {books.map(book => (
                <BookRow
                  key={book._id}
                  editBooksSubjects={editSubjectsForBook}
                  editBooksTags={editTagsForBook}
                  {...{ book, editBook, online, setRead, booksUiState, dispatchBooksUiState, runDelete }}
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
