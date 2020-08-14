import React, { SFC, useContext, useRef, useEffect, useMemo, useCallback } from "react";
import { RemovableLabelDisplay } from "app/components/subjectsAndTags/LabelDisplay";

import { useCurrentSearch } from "../booksSearchState";
import { AppContext, ModuleUpdateContext } from "app/renderUI";

import styles from "./styles.module.css";
import { setPage, quickSearch, pageOne, removeFilters, removeFilterSubject, removeFilterTag, clearAllFilters } from "../setBookFilters";
const { searchInput } = styles;

import PublicBooksHeader from "./publicBooksHeader";
import { BooksModuleContext } from "../books";

import cn from "classnames";

interface IAddedMenuProps {
  disabled?: boolean;
  uiView: any;
  uiDispatch: any;
  bookResultsPacket: {
    books: any;
    totalPages: any;
    resultsCount: any;
    reload?: any;
  };
  measureRef?: any;
}

const filterDisplayStyles = { flex: "0 0 auto", alignSelf: "center", marginRight: "5px", marginTop: "4px", marginBottom: "4px" };

export const BooksMenuBarDisabled: SFC<{ totalPages: number; resultsCount: number; measureRef: any }> = ({
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
const BooksMenuBar: SFC<IAddedMenuProps> = props => {
  const { books = [], totalPages = null, resultsCount = null, reload } = props.bookResultsPacket || {};
  const quickSearchEl = useRef(null);
  const [appState] = useContext(AppContext);

  const { isPending: booksLoading, startTransition } = useContext(ModuleUpdateContext);
  const reloadBooks = () => {
    startTransition(reload);
  };

  const { actions, booksUiState } = useContext(BooksModuleContext);
  const { setRead } = actions;

  const { uiView, uiDispatch, disabled, measureRef } = props;
  const { selectedBooks } = booksUiState;
  const selectedBooksCount = useMemo(() => Object.keys(selectedBooks).filter(k => selectedBooks[k]).length, [selectedBooks]);
  const selectedBooksIds = useMemo(() => Object.keys(selectedBooks).filter(k => selectedBooks[k]), [selectedBooks]);

  const bookSearchState = useCurrentSearch();

  const editSubjectsForSelectedBooks = () => actions.openBookSubModal(books.filter(b => booksUiState.selectedBooks[b._id]));
  const editTagsForSelectedBooks = () => actions.openBookTagModal(books.filter(b => booksUiState.selectedBooks[b._id]));

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

  let { isPublic, online } = appState;

  const Button = useCallback(
    ({ children, ...rest }) => (
      <button {...rest} disabled={disabled || rest.disabled}>
        {children}
      </button>
    ),
    [disabled]
  );

  return (
    <div ref={measureRef} style={{ position: "sticky", top: 0, marginTop: "-2px", paddingTop: "2px", backgroundColor: "white", zIndex: 1 }}>
      <div className="booksMenuBar" style={{ fontSize: "11pt", paddingBottom: "5px", position: "relative" }}>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "5px" }}>
          {isPublic ? <PublicBooksHeader /> : null}
          <PagingButtons {...{ selectedBooksCount, totalPages, resultsCount, Button, disabled }} />
          <div style={{ marginRight: "5px" }}>
            <div className="btn-group">
              <input
                ref={quickSearchEl}
                defaultValue={bookSearchState.search}
                onBlur={resetSearch}
                name="search"
                className={`form-control ${searchInput} tiny-orphan`}
                placeholder="Title search"
                onKeyDown={quickSearchType}
                disabled={disabled}
              />
              {!selectedBooksCount ? (
                <>
                  {online ? (
                    <>
                      <Button
                        title="Filter search"
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        onClick={actions.beginEditFilters}
                        className="btn btn-default hidden-tiny"
                      >
                        <i className="fal fa-filter" />
                      </Button>
                      {!isPublic ? (
                        <>
                          <Button title="Edit subjects" onClick={actions.editSubjects} className="btn btn-default hidden-xs">
                            <i className="fal fa-sitemap" />
                          </Button>
                          <Button title="Edit tags" onClick={actions.editTags} className="btn btn-default hidden-xs">
                            <i className="fal fa-tags" />
                          </Button>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  <Button className="btn btn-default hidden-tiny" onClick={reloadBooks} disabled={booksLoading}>
                    <i className="fal fa-sync"></i>
                  </Button>
                  <Button
                    onClick={() => uiDispatch({ type: "SET_GRID_VIEW" })}
                    className={"btn btn-default hidden-tiny " + (uiView.isGridView ? "active" : "")}
                  >
                    <i className="fal fa-table" />
                  </Button>
                  <Button
                    onClick={() => uiDispatch({ type: "SET_COVERS_LIST_VIEW" })}
                    className={"btn btn-default hidden-tiny " + (uiView.isCoversList ? "active" : "")}
                  >
                    <i className="fas fa-th" />
                  </Button>
                  <Button
                    onClick={() => uiDispatch({ type: "SET_BASIC_LIST_VIEW" })}
                    className={"btn btn-default hidden-tiny " + (uiView.isBasicList ? "active" : "")}
                  >
                    <i className="fal fa-list" />
                  </Button>
                </>
              ) : !isPublic ? (
                <>
                  <Button title="Add/remove subjects" onClick={editSubjectsForSelectedBooks} className={"btn btn-default hidden-tiny"}>
                    <i className="fal fa-sitemap" />
                  </Button>
                  <Button title="Add/remove tags" onClick={editTagsForSelectedBooks} className="btn btn-default hidden-tiny">
                    <i className="fal fa-tags" />
                  </Button>
                  <Button title="Set read" onClick={() => setRead(selectedBooksIds, true)} className={"btn btn-default hidden-tiny"}>
                    <i className="fal fa-eye" />
                  </Button>
                  <Button
                    title="Set un-read"
                    onClick={() => setRead(selectedBooksIds, false)}
                    className="btn btn-default put-line-through hidden-tiny"
                  >
                    <i className="fal fa-eye-slash" />
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <BookSearchFilters resultsCount={resultsCount} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

const PagingButtons: SFC<{ selectedBooksCount: number; totalPages: number; resultsCount: number; Button: any; disabled: boolean }> = props => {
  const { selectedBooksCount, totalPages, resultsCount, Button, disabled } = props;

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
      {!selectedBooksCount ? (
        <div className="visible-xs" style={{ marginRight: "5px" }}>
          <div>
            <Button onClick={pageDown} disabled={!canPageDown} className="btn btn-default btn-group-size">
              <i className="fal fa-angle-left" />
            </Button>
            <span className={cn({ disabled })} style={{ paddingLeft: "3px", paddingRight: "3px" }}>
              {page} of {totalPages}
            </span>
            <Button onClick={pageUp} disabled={!canPageUp} className="btn btn-default btn-group-size">
              <i className="fal fa-angle-right" />
            </Button>
          </div>
        </div>
      ) : null}
      <div className="hidden-xs" style={{ display: "flex", marginRight: "5px", alignItems: "center" }}>
        <div className="btn-group">
          <Button onClick={pageOne} disabled={!canPageOne} className="btn btn-default">
            <i className="fal fa-angle-double-left" />
          </Button>
          <Button onClick={pageDown} disabled={!canPageDown} className="btn btn-default" style={{ marginRight: "5px" }}>
            <i className="fal fa-angle-left" />
          </Button>
        </div>
        {online && resultsCount ? (
          <span className={cn({ disabled })} style={{ display: "inline" }}>
            <span className="hidden-xs">Page</span> {page}
            <span> of {totalPages}</span>
          </span>
        ) : null}
        <div className="btn-group">
          <Button onClick={pageUp} disabled={!canPageUp} className="btn btn-default" style={{ marginLeft: "5px" }}>
            <i className="fal fa-angle-right" />
          </Button>
          {/* TODO: pageLast */}
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

type BookSearchFilters = {
  resultsCount: number;
};

const BookSearchFilters: SFC<{ resultsCount: number; disabled: boolean }> = ({ resultsCount, disabled }) => {
  const [appState] = useContext(AppContext);
  const { online } = appState;
  const bookSearchState = useCurrentSearch();

  let resultsDisplay = resultsCount ? `${resultsCount} Book${resultsCount === 1 ? "" : "s"}` : "";
  let removeAllFiltersLabel = {
    backgroundColor: "red",
    textColor: "white",
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
            item={{ backgroundColor: `${bookSearchState.isRead == "1" ? "green" : "red"}` }}
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
