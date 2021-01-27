import React, { useContext, FunctionComponent } from "react";
import cn from "classnames";
import { AppContext } from "app/renderUI";

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
          <Button onClick={pageOne} disabled={!canPageOne} className="btn btn-default page-edge">
            <i className="fal fa-angle-double-left" />
          </Button>
          <Button onClick={pageDown} disabled={!canPageDown} className="btn btn-default page" style={{ marginRight: "5px" }}>
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
          <Button onClick={pageUp} disabled={!canPageUp} className="btn btn-default page" style={{ marginLeft: "5px" }}>
            <i className="fal fa-angle-right" />
          </Button>
          {online ? (
            <Button onClick={pageLast} disabled={!canPageLast} className="btn btn-default page-edge">
              <i className="fal fa-angle-double-right" />
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default PagingButtons;