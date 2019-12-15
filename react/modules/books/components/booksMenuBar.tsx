import React, { SFC, useContext, useRef, useEffect, useMemo } from "react";
import { RemovableLabelDisplay } from "app/components/labelDisplay";

import { useCurrentSearch } from "../booksSearchState";
import { useBooks } from "../booksState";
import { AppContext } from "app/renderUI";

import styles from "./styles.module.css";
import { setPage, quickSearch, pageOne, removeFilters, removeFilterSubject, removeFilterTag, clearAllFilters } from "../setBookFilters";
const { searchInput } = styles;

interface IAddedMenuProps {
  editTags: any;
  editSubjects: any;
  startSubjectModification: any;
  startTagModification: any;
  beginEditFilters: any;
  booksUiState: any;
  setRead: any;
  uiView: any;
  uiDispatch: any;
}

const filterDisplayStyles = { flex: "0 0 auto", alignSelf: "center", marginRight: "5px", marginTop: "4px", marginBottom: "4px" };

const BooksMenuBar: SFC<IAddedMenuProps> = props => {
  const quickSearchEl = useRef(null);

  const [appState] = useContext(AppContext);
  const { totalPages, resultsCount } = useBooks();

  const { booksUiState, setRead, uiView, uiDispatch } = props;
  const { selectedBooks } = booksUiState;
  const selectedBooksCount = useMemo(() => Object.keys(selectedBooks).filter(k => selectedBooks[k]).length, [selectedBooks]);
  const selectedBooksIds = useMemo(() => Object.keys(selectedBooks).filter(k => selectedBooks[k]), [selectedBooks]);

  const bookSearchState = useCurrentSearch();

  useEffect(() => {
    quickSearchEl.current.value = bookSearchState.search;
  }, [bookSearchState.search]);

  const resetSearch = () => {
    quickSearchEl.current.value = bookSearchState.search;
  };
  const quickSearchType = evt => {
    if (evt.keyCode == 13) {
      evt.preventDefault();
      quickSearch(evt.currentTarget.value);
    }
  };

  let { page, pageSize, activeFilterCount } = bookSearchState;
  let { isPublic, publicBooksHeader, publicName, online } = appState;
  let booksHeader = isPublic ? publicBooksHeader || `${publicName}'s Books` : "Your Books";

  let canPageUp = online ? page < totalPages : resultsCount == pageSize;
  let canPageDown = page > 1;
  let canPageOne = page > 1;
  let canPageLast = page < totalPages;

  let resultsDisplay = resultsCount ? `${resultsCount} Book${resultsCount === 1 ? "" : "s"}` : "";
  let removeAllFiltersLabel = {
    backgroundColor: "red",
    textColor: "white",
    name: "Remove all filters"
  };

  let pageUp = () => setPage(+page + 1);
  let pageDown = () => setPage(+page - 1);
  let pageLast = () => setPage(totalPages);

  return (
    <div>
      <div className="booksMenuBar" style={{ fontSize: "11pt", paddingBottom: "5px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "5px" }}>
          {isPublic ? <h4 style={{ marginRight: "5px", marginBottom: 0, alignSelf: "center" }}>{booksHeader}</h4> : null}
          {!selectedBooksCount ? (
            <div className="visible-xs" style={{ marginRight: "5px" }}>
              <div>
                <button onClick={pageDown} disabled={!canPageDown} className="btn btn-default">
                  <i className="fal fa-angle-left" />
                </button>
                <span style={{ paddingLeft: "3px", paddingRight: "3px" }}>
                  {page} of {totalPages}
                </span>
                <button onClick={pageUp} disabled={!canPageUp} className="btn btn-default">
                  <i className="fal fa-angle-right" />
                </button>
              </div>
            </div>
          ) : null}
          <div className="hidden-xs" style={{ display: "flex", marginRight: "5px", alignItems: "center" }}>
            <div className="btn-group">
              <button onClick={pageOne} disabled={!canPageOne} className="btn btn-default">
                <i className="fal fa-angle-double-left" />
              </button>
              <button onClick={pageDown} disabled={!canPageDown} className="btn btn-default" style={{ marginRight: "5px" }}>
                <i className="fal fa-angle-left" />
              </button>
            </div>
            {online && resultsCount ? (
              <span style={{ display: "inline" }}>
                <span className="hidden-xs">Page</span> {page}
                <span> of {totalPages}</span>
              </span>
            ) : null}
            <div className="btn-group">
              <button onClick={pageUp} disabled={!canPageUp} className="btn btn-default" style={{ marginLeft: "5px" }}>
                <i className="fal fa-angle-right" />
              </button>
              {/* TODO: pageLast */}
              {online ? (
                <button onClick={pageLast} disabled={!canPageLast} className="btn btn-default">
                  <i className="fal fa-angle-double-right" />
                </button>
              ) : null}
            </div>
          </div>
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
              />
              {!selectedBooksCount ? (
                <>
                  {online ? (
                    <>
                      <button
                        title="Filter search"
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        onClick={props.beginEditFilters}
                        className="btn btn-default hidden-tiny"
                      >
                        <i className="fal fa-filter" />
                      </button>
                      {!isPublic ? (
                        <>
                          <button title="Edit subjects" onClick={props.editSubjects} className="btn btn-default hidden-xs">
                            <i className="fal fa-sitemap" />
                          </button>
                          <button title="Edit tags" onClick={props.editTags} className="btn btn-default hidden-xs">
                            <i className="fal fa-tags" />
                          </button>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  <button
                    style={{ position: "static" }}
                    onClick={() => uiDispatch({ type: "SET_GRID_VIEW" })}
                    className={"btn btn-default hidden-tiny " + (uiView.isGridView ? "active" : "")}
                  >
                    <i className="fal fa-table" />
                  </button>
                  <button
                    style={{ position: "static" }}
                    onClick={() => uiDispatch({ type: "SET_COVERS_LIST_VIEW" })}
                    className={"btn btn-default hidden-tiny " + (uiView.isCoversList ? "active" : "")}
                  >
                    <i className="fas fa-th" />
                  </button>
                  <button
                    style={{ position: "static" }}
                    onClick={() => uiDispatch({ type: "SET_BASIC_LIST_VIEW" })}
                    className={"btn btn-default hidden-tiny " + (uiView.isBasicList ? "active" : "")}
                  >
                    <i className="fal fa-list" />
                  </button>
                </>
              ) : !isPublic ? (
                <>
                  <button title="Add/remove subjects" onClick={props.startSubjectModification} className={"btn btn-default hidden-tiny"}>
                    <i className="fal fa-sitemap" />
                  </button>
                  <button title="Add/remove tags" onClick={props.startTagModification} className="btn btn-default hidden-tiny">
                    <i className="fal fa-tags" />
                  </button>
                  <button title="Set read" onClick={() => setRead(selectedBooksIds, true)} className={"btn btn-default hidden-tiny"}>
                    <i className="fal fa-eye" />
                  </button>
                  <button
                    title="Set un-read"
                    onClick={() => setRead(selectedBooksIds, false)}
                    className="btn btn-default put-line-through hidden-tiny"
                  >
                    <i className="fal fa-eye-slash" />
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", alignContent: "center", flexWrap: "wrap" }}>
            {online && resultsCount ? <div style={{ flex: "0 0 auto", marginRight: "5px", alignSelf: "center" }}>{resultsDisplay}</div> : null}

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
                item={{ name: `publisher: "${bookSearchState.publisher}"` }}
                doRemove={() => removeFilters("publisher")}
              />
            ) : null}
            {bookSearchState.author ? (
              <RemovableLabelDisplay
                style={filterDisplayStyles}
                item={{ name: `author: "${bookSearchState.author}"` }}
                doRemove={() => removeFilters("author")}
              />
            ) : null}
            {bookSearchState.pages || bookSearchState.pages == "0" ? (
              <RemovableLabelDisplay
                style={filterDisplayStyles}
                item={{ name: `pages: ${bookSearchState.pagesOperator == "lt" ? "<" : ">"} ${bookSearchState.pages}` }}
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
            {activeFilterCount > 1 ? (
              <RemovableLabelDisplay style={filterDisplayStyles} item={removeAllFiltersLabel} doRemove={clearAllFilters} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksMenuBar;
