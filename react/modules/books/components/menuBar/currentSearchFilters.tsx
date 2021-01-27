import React, { useContext, FunctionComponent } from "react";
import cn from "classnames";

import { RemovableLabelDisplay } from "app/components/subjectsAndTags/LabelDisplay";

import { AppContext } from "app/renderUI";
import { useCurrentSearch } from "../../booksSearchState";
import { removeFilters, removeFilterSubject, removeFilterTag, clearAllFilters } from "../../setBookFilters";

const filterDisplayStyles = { flex: "0 0 auto", alignSelf: "center", marginRight: "5px", marginTop: "4px", marginBottom: "4px" };

const CurrentSearchFilters: FunctionComponent<{ resultsCount: number; disabled: boolean }> = ({ resultsCount, disabled }) => {
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

export default CurrentSearchFilters;