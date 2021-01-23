import React, { useContext, useRef, useEffect, useMemo, useCallback, FunctionComponent, useState } from "react";
import cn from "classnames";

import { RemovableLabelDisplay } from "app/components/subjectsAndTags/LabelDisplay";

import { useCurrentSearch } from "../booksSearchState";
import { AppContext, ModuleUpdateContext } from "app/renderUI";

import "./book-menu-bar-styles.scss";
import { setPage, quickSearch, pageOne, removeFilters, removeFilterSubject, removeFilterTag, clearAllFilters } from "../setBookFilters";

import PublicBooksHeader from "./publicBooksHeader";
import { BooksModuleContext } from "../books";

interface IAddedMenuProps {
  disabled?: boolean;
  uiView: any;
  uiDispatch: any;
  bookResultsPacket: {
    books: any;
    totalPages: any;
    resultsCount: any;
    booksLoaded?: any;
    reload?: any;
  };
  measureRef?: any;
}

const filterDisplayStyles = { flex: "0 0 auto", alignSelf: "center", marginRight: "5px", marginTop: "4px", marginBottom: "4px" };

export const BooksMenuBarDisabled: FunctionComponent<{ totalPages: number; resultsCount: number; measureRef: any }> = ({
  totalPages,
  resultsCount,
  measureRef
}) => {
  const bookResultsPacket = {
    books: [],
    totalPages,
    resultsCount
  };
  return <BooksMenuBar measureRef={measureRef} disabled={true} uiView={{}} uiDispatch={() => {}} bookResultsPacket={bookResultsPacket} />;
};
const BooksMenuBar: FunctionComponent<IAddedMenuProps> = props => {
  const { uiView, uiDispatch, disabled, measureRef, bookResultsPacket } = props;
  const { books = [], totalPages = null, resultsCount = null, booksLoaded } = bookResultsPacket || {};
  const quickSearchEl = useRef(null);
  const [appState] = useContext(AppContext);

  const { actions, booksUiState } = useContext(BooksModuleContext);

  const { selectedBooks } = booksUiState;
  const selectedBooksCount = useMemo(() => Object.keys(selectedBooks).filter(k => selectedBooks[k]).length, [selectedBooks]);

  const bookSearchState = useCurrentSearch();

  useEffect(() => {
    quickSearchEl.current.value = bookSearchState.search;
  }, [bookSearchState.search]);

  const resetSearch = () => {
    quickSearchEl.current.value = bookSearchState.search;
  };
  const quickSearchType = evt => {
    if (evt.keyCode == 13) {
      quickSearch(evt.currentTarget.value);
    }
  };

  let { isPublic } = appState;

  const Button = useCallback(
    ({ children, ...rest }) => (
      <button {...rest} disabled={disabled || rest.disabled}>
        {children}
      </button>
    ),
    [disabled]
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="books-menu-bar" ref={measureRef}>
      <div className={cn("mobile-menu", { open: mobileMenuOpen })}>
        <div style={{ border: "1px solid red" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <button onClick={() => setMobileMenuOpen(false)}>Close</button>
            <MenuOptions {...{ Button, selectedBooksCount, uiView, uiDispatch, bookResultsPacket }} />
          </div>
        </div>
      </div>

      <div className="booksMenuBar" style={{ fontSize: "11pt", position: "relative" }}>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "5px" }}>
          <a style={{ fontSize: "1.4rem", alignSelf: "center" }} className="mobile-menu-button margin-right" onClick={() => setMobileMenuOpen(true)}>
            <i className="far fa-bars"></i>
          </a>
          {isPublic ? <PublicBooksHeader /> : null}
          <PagingButtons {...{ selectedBooksCount, totalPages, resultsCount, booksLoaded, Button, disabled }} />
          <div style={{ marginRight: "5px" }}>
            <div className="menu-bar-desktop btn-group">
              <input
                ref={quickSearchEl}
                defaultValue={bookSearchState.search}
                onBlur={resetSearch}
                name="search"
                className={`form-control search-input tiny-orphan`}
                placeholder="Title search"
                onKeyDown={quickSearchType}
                disabled={disabled}
              />
              <MenuOptions {...{ Button, selectedBooksCount, uiView, uiDispatch, bookResultsPacket }} />
            </div>
          </div>

          <BookSearchFilters resultsCount={resultsCount} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

const PagingButtons: FunctionComponent<{
  selectedBooksCount: number;
  totalPages: number;
  resultsCount: number;
  Button: any;
  disabled: boolean;
  booksLoaded: boolean;
}> = props => {
  const { selectedBooksCount, totalPages, resultsCount, booksLoaded, Button, disabled } = props;

  const [appState] = useContext(AppContext);
  const { online } = appState;

  const bookSearchState = useCurrentSearch();
  const { page, pageSize } = bookSearchState;

  let canPageUp = online ? page < totalPages : resultsCount == pageSize;
  let canPageDown = page > 1;
  let canPageOne = page > 1;
  let canPageLast = page < totalPages;

  let pageUp = () => setPage(+page + 1);
  let pageDown = () => setPage(+page - 1);
  let pageLast = () => setPage(totalPages);

  return (
    <>
      <div style={{ display: "flex", marginRight: "5px", alignItems: "center" }}>
        <div className="btn-group">
          <Button onClick={pageOne} disabled={!canPageOne} className="btn btn-default">
            <i className="fal fa-angle-double-left" />
          </Button>
          <Button onClick={pageDown} disabled={!canPageDown} className="btn btn-default" style={{ marginRight: "5px" }}>
            <i className="fal fa-angle-left" />
          </Button>
        </div>
        {online ? (
          <span className={cn({ disabled })} style={{ display: "inline", minWidth: "7ch" }}>
            {!booksLoaded ? (
              <span>Loading...</span>
            ) : resultsCount ? (
              <span>
                Page {page} of {totalPages}
              </span>
            ) : (
              <span>No results</span>
            )}
          </span>
        ) : null}
        <div className="btn-group">
          <Button onClick={pageUp} disabled={!canPageUp} className="btn btn-default" style={{ marginLeft: "5px" }}>
            <i className="fal fa-angle-right" />
          </Button>
          {online ? (
            <Button onClick={pageLast} disabled={!canPageLast} className="btn btn-default">
              <i className="fal fa-angle-double-right" />
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
};

const MenuOptions: FunctionComponent<{
  Button: any;
  selectedBooksCount: number;
  uiView: any;
  uiDispatch: any;
  bookResultsPacket: any;
}> = props => {
  const [appState] = useContext(AppContext);
  const { Button, selectedBooksCount, uiView, uiDispatch, bookResultsPacket } = props;

  let { isPublic, online } = appState;
  const { actions, booksUiState } = useContext(BooksModuleContext);
  const { setRead } = actions;

  const { selectedBooks } = booksUiState;
  const selectedBooksIds = useMemo(() => Object.keys(selectedBooks).filter(k => selectedBooks[k]), [selectedBooks]);

  const { books = [], reload } = bookResultsPacket || {};

  const editSubjectsForSelectedBooks = () => actions.openBookSubModal(books.filter(b => booksUiState.selectedBooks[b._id]));
  const editTagsForSelectedBooks = () => actions.openBookTagModal(books.filter(b => booksUiState.selectedBooks[b._id]));

  const { isPending: booksLoading, startTransition } = useContext(ModuleUpdateContext);
  const reloadBooks = () => {
    startTransition(reload);
  };

  return !selectedBooksCount ? (
    <>
      {online ? (
        <>
          <Button
            title="Filter search"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            onClick={actions.beginEditFilters}
            className="btn btn-default"
          >
            <span>Set Filters</span>
            <i className="fal fa-filter" />
          </Button>
          <hr />
          {!isPublic ? (
            <>
              <Button title="Edit subjects" onClick={actions.editSubjects} className="btn btn-default">
                <span>Edit Subjects</span>
                <i className="fal fa-sitemap" />
              </Button>
              <Button title="Edit tags" onClick={actions.editTags} className="btn btn-default">
                <span>Edit Tags</span>
                <i className="fal fa-tags" />
              </Button>
              <hr />
            </>
          ) : null}
        </>
      ) : null}
      <Button className="btn btn-default" onClick={reloadBooks} disabled={booksLoading}>
        <span>Reload Books</span>
        <i className="fal fa-sync"></i>
      </Button>
      <hr />
      <Button onClick={() => uiDispatch({ type: "SET_GRID_VIEW" })} className={"btn btn-default" + (uiView.isGridView ? "active" : "")}>
        <span>Grid View</span>
        <i className="fal fa-table" />
      </Button>
      <Button onClick={() => uiDispatch({ type: "SET_COVERS_LIST_VIEW" })} className={"btn btn-default" + (uiView.isCoversList ? "active" : "")}>
        <span>Covers View</span>
        <i className="fas fa-th" />
      </Button>
      <Button onClick={() => uiDispatch({ type: "SET_BASIC_LIST_VIEW" })} className={"btn btn-default" + (uiView.isBasicList ? "active" : "")}>
        <span>Mobile View</span>
        <i className="fal fa-list" />
      </Button>
      <hr />
    </>
  ) : !isPublic ? (
    <>
      <Button title="Add/remove subjects" onClick={editSubjectsForSelectedBooks} className={"btn btn-default hidden-tiny"}>
        <span>Add / Remove Subjects</span>
        <i className="fal fa-sitemap" />
      </Button>
      <Button title="Add/remove tags" onClick={editTagsForSelectedBooks} className="btn btn-default hidden-tiny">
        <span>Add / Remove Tags</span>
        <i className="fal fa-tags" />
      </Button>
      <Button title="Set read" onClick={() => setRead(selectedBooksIds, true)} className={"btn btn-default hidden-tiny"}>
        <span>Set Read</span>
        <i className="fal fa-eye" />
      </Button>
      <Button title="Set un-read" onClick={() => setRead(selectedBooksIds, false)} className="btn btn-default put-line-through hidden-tiny">
        <span>Set Un-Read</span>
        <i className="fal fa-eye-slash" />
      </Button>
      <hr />
    </>
  ) : null;
};

type BookSearchFilters = {
  resultsCount: number;
};

const BookSearchFilters: FunctionComponent<{ resultsCount: number; disabled: boolean }> = ({ resultsCount, disabled }) => {
  const [appState] = useContext(AppContext);
  const { online } = appState;
  const bookSearchState = useCurrentSearch();

  let resultsDisplay = resultsCount ? `${resultsCount} Book${resultsCount === 1 ? "" : "s"}` : "";
  let removeAllFiltersLabel = {
    backgroundColor: "var(--danger-7)",
    name: "Remove all filters"
  };

  return (
    <>
      {online && resultsCount ? <div style={{ flex: "0 0 auto", marginRight: "5px", alignSelf: "center" }}>{resultsDisplay}</div> : null}
      <div className={cn({ disabled })} style={{ display: "flex", alignItems: "flex-start", alignContent: "center", flexWrap: "wrap" }}>
        {bookSearchState.search ? (
          <RemovableLabelDisplay
            style={{ flex: "0 0 auto", alignSelf: "center", marginRight: "5px", marginTop: "4px", marginBottom: "4px" }}
            item={{ name: `"${bookSearchState.search}"` }}
            doRemove={() => removeFilters("search")}
          />
        ) : null}
        {bookSearchState.isRead == "1" || bookSearchState.isRead == "0" ? (
          <RemovableLabelDisplay
            style={{ flex: "0 0 auto", alignSelf: "center", marginRight: "5px", marginTop: "4px", marginBottom: "4px" }}
            doRemove={() => removeFilters("isRead")}
          >
            <span>
              {bookSearchState.isRead == "1" ? "Is Read" : "Not Read"}
              &nbsp;
              {bookSearchState.isRead == "1" ? <i className="far fa-check" /> : null}
            </span>
          </RemovableLabelDisplay>
        ) : null}
        {bookSearchState.publisher ? (
          <RemovableLabelDisplay
            style={filterDisplayStyles}
            item={{ name: `Publisher: "${bookSearchState.publisher}"` }}
            doRemove={() => removeFilters("publisher")}
          />
        ) : null}
        {bookSearchState.author ? (
          <RemovableLabelDisplay
            style={filterDisplayStyles}
            item={{ name: `Author: "${bookSearchState.author}"` }}
            doRemove={() => removeFilters("author")}
          />
        ) : null}
        {bookSearchState.pages || bookSearchState.pages == "0" ? (
          <RemovableLabelDisplay
            style={filterDisplayStyles}
            item={{ name: `Pages: ${bookSearchState.pagesOperator == "lt" ? "<" : ">"} ${bookSearchState.pages}` }}
            doRemove={() => removeFilters("pages", "pagesOperator")}
          />
        ) : null}
        {bookSearchState.noSubjects ? (
          <RemovableLabelDisplay style={filterDisplayStyles} item={{ name: `No subjects` }} doRemove={() => removeFilters("noSubjects")} />
        ) : null}

        {bookSearchState.selectedSubjects.map(s => (
          <RemovableLabelDisplay style={filterDisplayStyles} item={s} doRemove={() => removeFilterSubject(s._id)} />
        ))}
        {bookSearchState.selectedTags.map(t => (
          <RemovableLabelDisplay style={filterDisplayStyles} item={t} doRemove={() => removeFilterTag(t._id)} />
        ))}
        {bookSearchState.activeFilterCount > 1 ? (
          <RemovableLabelDisplay style={filterDisplayStyles} item={removeAllFiltersLabel} doRemove={clearAllFilters} />
        ) : null}
      </div>
    </>
  );
};

export default BooksMenuBar;
