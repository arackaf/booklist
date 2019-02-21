import React, { SFC, CSSProperties, useContext } from "react";

import { AjaxButton } from "applicationRoot/components/bootstrapButton";
import { LabelDisplay } from "applicationRoot/components/labelDisplay";

import { AppContext } from "applicationRoot/renderUI";
import { useBookSelection, useBookList, IBookDisplay, BooksContext } from "../booksState";
import { useCurrentSearch } from "../booksSearchState";

interface ILocalProps {
  book: IBookDisplay;
  editBooksSubjects: any;
  editBooksTags: any;
  index: number;
  editBook: any;
  online: any;
}

const BookRow: SFC<ILocalProps> = props => {
  let [{ isPublic: viewingPublic, publicUserId }] = useContext(AppContext);
  let { book, index } = props;

  let { collapseBook, expandBook, setPendingDeleteBook, cancelPendingDeleteBook, deleteBook, setUnRead, setRead } = {} as any;

  let { selectedBooks, toggleSelectBook } = useContext(BooksContext);
  let style: any = { backgroundColor: index % 2 ? "white" : "#f9f9f9" };

  let [{ online }] = useContext(AppContext);

  return (
    <tr key={book._id} style={style}>
      {!viewingPublic && online ? (
        <td>
          <a style={{ fontSize: "12pt" }} onClick={() => toggleSelectBook(book._id)}>
            <i className={"fal " + (!!selectedBooks[book._id] ? "fa-check-square" : "fa-square")} />
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
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="fa fa-fw fa-spin fa-spinner" />
            </a>
          ) : book.expanded ? (
            <a target="_new" onClick={() => collapseBook(book._id)} className="margin-right grid-hover-filter inline-filter">
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="far fa-minus show-on-hover-parent-td" />
            </a>
          ) : (
            <a target="_new" onClick={() => expandBook(book._id, publicUserId)} className="margin-right grid-hover-filter inline-filter">
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="far fa-plus show-on-hover-parent-td" />
            </a>
          )
        ) : null}
        {book.isbn && online ? (
          <a
            target="_new"
            className="margin-right grid-hover-filter inline-filter"
            href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
          >
            <i style={{ display: book.pendingDelete ? "inline" : "" }} className="fab fa-amazon show-on-hover-parent-td" />
          </a>
        ) : null}
        {!viewingPublic && online ? (
          <>
            <a className="margin-right grid-hover-filter inline-filter" onClick={() => props.editBook(book)}>
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="fal fa-pencil-alt show-on-hover-parent-td" />
            </a>
            <a className="margin-right grid-hover-filter inline-filter" onClick={() => setPendingDeleteBook(book)}>
              <i style={{ display: book.pendingDelete ? "inline" : "" }} className="fal fa-trash-alt show-on-hover-parent-td" />
            </a>
          </>
        ) : null}
        {book.pendingDelete ? (
          <AjaxButton running={book.deleting} runningText="Deleting" onClick={() => deleteBook(book)} className="btn btn-xs btn-danger margin-right">
            Confirm delete
          </AjaxButton>
        ) : null}
        {book.pendingDelete ? (
          <button onClick={() => cancelPendingDeleteBook(book)} className="btn btn-xs btn-primary">
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
              <AjaxButton running={!!book.readChanging} runningText=" " onClick={() => setUnRead(book._id)} preset="success-xs">
                Read <i className="fa fa-fw fa-check" />
              </AjaxButton>
            ) : (
              <AjaxButton running={!!book.readChanging} runningText=" " onClick={() => setRead(book._id)} preset="default-xs">
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

type BookViewListGridTypes = { editBooksSubjects: any; editBooksTags: any; editBook: any };

const BookViewListGrid: SFC<BookViewListGridTypes> = props => {
  //let [{}, ] = useContext(BooksContext);
  let { setSortOrder, toggleCheckAll } = {} as any;
  const { booksList } = useBookList();
  const { allAreChecked } = useBookSelection();
  const [{ isPublic: viewingPublic, online }] = useContext(AppContext);
  const { sort: currentSort, sortDirection } = useCurrentSearch();

  const setSort = column => {
    let newDirection = "asc";
    if (currentSort === column) {
      newDirection = sortDirection == "asc" ? "desc" : "asc";
    }

    setSortOrder(column, newDirection);
  };

  const potentialSortIcon = <i className={"fa fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />;
  const sortIconIf = column => (column == currentSort ? potentialSortIcon : null);

  const { editBooksSubjects, editBooksTags } = props;
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
              {booksList.map((book, index) => [
                <BookRow
                  key={0}
                  editBooksSubjects={editBooksSubjects}
                  editBooksTags={editBooksTags}
                  book={book}
                  editBook={props.editBook}
                  index={index}
                  online={online}
                />,
                book.expanded ? <BookRowDetails key={1} book={book} index={index} /> : null
              ])}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default BookViewListGrid;
