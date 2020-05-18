import React, { SFC, CSSProperties, useContext, useMemo, useState } from "react";

import { ActionButton } from "app/components/ui/Button";
import { LabelDisplay } from "app/components/subjectsAndTags/LabelDisplay";

import { AppContext } from "app/renderUI";
import { IBookDisplay } from "../../booksState";
import { useCurrentSearch } from "../../booksSearchState";

import BookDetailsQuery from "graphQL/books/getBookDetails.graphql";
import { useQuery, buildQuery } from "micro-graphql-react";

import uiStyles from "./uiStyles.module.css";
import gridStyles from "./gridList.module.css";
import { CoverSmall } from "app/components/bookCoverComponent";
import { QueryOf, Queries } from "graphql-typings";
import { setBooksSort } from "modules/books/setBookFilters";
import { BooksModuleContext } from "modules/books/books";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";
import FlowItems from "app/components/layout/FlowItems";
import useDelete from "app/helpers/useDelete";

const { bookTitle, bookAuthor } = uiStyles;
const { gridHoverFilter, detailsRow } = gridStyles;

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

const BookRow: SFC<ILocalProps> = props => {
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
          <div style={{ minWidth: "75px", minHeight: "75px" }}>
            <CoverSmall url={book.smallImage} />
          </div>
        </td>
        <td>
          <Stack>
            <Stack tightest={true}>
              <div className={bookTitle}>{book.title}</div>
              {book.authors ? <div className={bookAuthor}>{book.authors.join(", ")}</div> : null}
            </Stack>

            <FlowItems vCenter={true} tighter={true} containerStyle={{ minHeight: "35px" }}>
              {online ? (
                detailsLoading ? (
                  <a style={hoverOverride} target="_new" className={`${gridHoverFilter}`}>
                    <i className="fa fa-fw fa-spin fa-spinner" />
                  </a>
                ) : expanded ? (
                  <a style={hoverOverride} target="_new" onClick={() => setExpanded(false)} className={`${gridHoverFilter}`}>
                    <i className={`far fa-minus`} />
                  </a>
                ) : (
                  <a style={hoverOverride} target="_new" onClick={() => setExpanded(true)} className={`${gridHoverFilter}`}>
                    <i className={`far fa-plus`} />
                  </a>
                )
              ) : null}
              {book.isbn && online ? (
                <a
                  style={{ ...hoverOverride, paddingTop: "1px" }}
                  target="_new"
                  className={`${gridHoverFilter}`}
                  href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
                >
                  <i className={`fab fa-amazon`} />
                </a>
              ) : null}
              {!viewingPublic && online ? (
                <>
                  <a style={hoverOverride} className={`${gridHoverFilter}`} onClick={() => props.editBook(book)}>
                    <i className="fal fa-pencil-alt"></i>
                  </a>
                  <a style={hoverOverride} className={`${gridHoverFilter}`} onClick={startDelete}>
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
                <LabelDisplay item={s} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 5 }}>
            {!viewingPublic ? (
              <a className={`${gridHoverFilter}`} onClick={() => props.editBooksSubjects(book)}>
                <i className="fal fa-pencil-alt"></i>
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
              <a className={`${gridHoverFilter}`} onClick={() => props.editBooksTags(book)}>
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
                  icon="fa fa-fw fa-check"
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
      {expanded ? <BookRowDetails {...{ book, setDetailsLoading }} /> : null}
    </>
  );
};

const BookRowDetails: SFC<{ book?: IBookDisplay; setDetailsLoading: any }> = props => {
  let [{ isPublic: viewingPublic }] = useContext(AppContext);
  let { book, setDetailsLoading } = props;

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
    <tr key={"details" + book._id}>
      <td colSpan={viewingPublic ? 8 : 9} style={{ borderTop: 0, paddingLeft: "50px", paddingTop: 0, paddingBottom: "15px" }}>
        <FlexRow className={`${detailsRow}`}>
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

const stickyHeaderStyle: CSSProperties = { position: "sticky", top: 0, backgroundColor: "white" };

export const GridViewShell: SFC<{}> = ({}) => {
  const [{ isPublic: viewingPublic, online }] = useContext(AppContext);

  return (
    <div style={{ minHeight: 400 }}>
      <div>
        <table style={{ position: "relative" }} className="table no-padding-top">
          <thead>
            <tr>
              {!viewingPublic && online ? (
                <th style={{ ...stickyHeaderStyle, textAlign: "center" }}>
                  <a style={{ fontSize: "12pt" }}>
                    <i className={"fal fa-square"} />
                  </a>
                </th>
              ) : null}
              <th style={{ ...stickyHeaderStyle }} />
              <th style={{ ...stickyHeaderStyle, minWidth: "200px" }}>
                <a className="no-underline">Title</a>
              </th>
              <th style={{ minWidth: "90px", ...stickyHeaderStyle }}>Subjects</th>
              <th style={{ minWidth: "90px", ...stickyHeaderStyle }}>Tags</th>
              <th style={{ minWidth: "90px", ...stickyHeaderStyle }} />
              <th style={{ ...stickyHeaderStyle }} />
              <th style={{ minWidth: "85px", ...stickyHeaderStyle }}>
                <a className="no-underline">Pages</a>
              </th>
              <th style={{ ...stickyHeaderStyle }}>
                <a className="no-underline">Added</a>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8}>
                <h1 style={{ color: "var(--neutral-5)" }}>
                  Books are loading <i className="fas fa-cog fa-spin"></i>
                </h1>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BookViewListGrid: SFC<{ books: any }> = ({ books }) => {
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

  const potentialSortIcon = <i className={"fa fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />;
  const sortIconIf = column => (column == currentSort ? potentialSortIcon : null);

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
