import React, { useContext, FunctionComponent } from "react";
import cn from "classnames";
import { AppContext } from "app/state/appState";

import { setPage, pageOne } from "../../setBookFilters";
import { useCurrentSearch } from "../../booksSearchState";

const PagingButtons: FunctionComponent<{
  selectedBooksCount: number;
  totalPages: number;
  resultsCount: number;
  Button: any;
  disabled: boolean;
  booksLoaded: boolean;
}> = props => {
  const { totalPages, resultsCount, booksLoaded, Button, disabled } = props;

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
          <Button aria-label="First page" onClick={pageOne} disabled={!canPageOne} className="btn btn-default page-edge">
            <i className="fal fa-angle-double-left" />
          </Button>
          <Button
            aria-label="Previous page"
            onClick={pageDown}
            disabled={!canPageDown}
            className="btn btn-default page"
            style={{ marginRight: "5px" }}
          >
            <i className="fal fa-angle-left" />
          </Button>
        </div>
        {online ? (
          <span className={cn({ disabled })} style={{ display: "inline" }}>
            <div className="results-holder overlay-holder">
              {!booksLoaded ? (
                <span>Loading...</span>
              ) : resultsCount ? (
                <span>
                  <span className="page-label">Page </span>
                  {page} of {totalPages}
                </span>
              ) : (
                <span>No results</span>
              )}
              <span style={{ visibility: "hidden" }}>
                <span className="page-label">Page </span>1 of 10
              </span>
            </div>
          </span>
        ) : null}
        <div className="btn-group">
          <Button aria-label="Next page" onClick={pageUp} disabled={!canPageUp} className="btn btn-default page" style={{ marginLeft: "5px" }}>
            <i className="fal fa-angle-right" />
          </Button>
          {online ? (
            <Button aria-label="Last page" onClick={pageLast} disabled={!canPageLast} className="btn btn-default page-edge">
              <i className="fal fa-angle-double-right" />
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default PagingButtons;
