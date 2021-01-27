import React, { useContext, useRef, useEffect, useMemo, useCallback, FunctionComponent, useState } from "react";
import cn from "classnames";

import "./book-menu-bar-styles.scss";

import { AppContext } from "app/renderUI";

import PagingButtons from "./pagingButtons";
import MenuOptions from "./menuOptions";
import CurrentSearchFilters from "./currentSearchFilters";

import { useCurrentSearch } from "../../booksSearchState";
import { quickSearch } from "../../setBookFilters";
import PublicBooksHeader from "../publicBooksHeader";
import { BooksModuleContext } from "../../books";

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

  const { booksUiState } = useContext(BooksModuleContext);

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
        <div>
          <div style={{ display: "flex" }}>
            <a style={{ fontSize: "1.4rem", alignSelf: "start" }} onClick={() => setMobileMenuOpen(false)}>
              <i className="far fa-bars"></i>
            </a>
            <h3 style={{ margin: "0 0 0 10px", alignSelf: "center" }}>Book Options</h3>
          </div>
          <div className="button-container" style={{ display: "flex", flexDirection: "column" }}>
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

          <CurrentSearchFilters resultsCount={resultsCount} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

type BookSearchFilters = {
  resultsCount: number;
};

export default BooksMenuBar;
