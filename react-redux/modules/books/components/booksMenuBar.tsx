import React, { Component } from "react";
import { connect } from "react-redux";

import { selectBookSelection, selectBookLoadingInfo } from "modules/books/reducers/books/reducer";
import { selectBookSearchState, selectBookSearchUiView } from "modules/books/reducers/bookSearch/reducer";

import * as booksActionCreators from "../reducers/books/actionCreators";
import * as bookSearchActionCreators from "../reducers/bookSearch/actionCreators";

import { RemovableLabelDisplay } from "applicationRoot/components/labelDisplay";

import { selectAppUiState, combineSelectors } from "applicationRoot/rootReducer";

type BookMenuBarType = ReturnType<typeof selectBookSearchState> &
  ReturnType<typeof selectBookLoadingInfo> &
  ReturnType<typeof selectBookSearchUiView> &
  ReturnType<typeof selectAppUiState> &
  ReturnType<typeof selectBookSelection>;

const menuBarSelector = combineSelectors<BookMenuBarType>(
  selectBookSearchState,
  selectBookSearchUiView,
  selectBookLoadingInfo,
  selectAppUiState,
  selectBookSelection
);

interface IAddedMenuProps {
  editTags: any;
  editSubjects: any;
  startSubjectModification: any;
  startTagModification: any;
  beginEditFilters: any;
}

@connect(
  menuBarSelector,
  { ...bookSearchActionCreators, ...booksActionCreators }
)
export default class BooksMenuBar extends Component<
  BookMenuBarType & typeof bookSearchActionCreators & typeof booksActionCreators & IAddedMenuProps,
  any
> {
  navBar: any;
  quickSearchEl: any;
  sortChanged(evt) {
    let value = evt.target.value,
      [sort, direction] = value.split("|");

    this.props.setSortOrder(sort, direction == "asc" ? "asc" : "desc");
  }
  componentDidUpdate(prevProps) {
    if (prevProps.search != this.props.search) {
      this.quickSearchEl && (this.quickSearchEl.value = this.props.search);
    }
  }
  quickSearch = evt => {
    evt.preventDefault();
    this.props.quickSearch(evt.currentTarget.value);
  };
  resetSearch = () => {
    this.quickSearchEl.value = this.props.search;
  };
  quickSearchType = evt => {
    if (evt.keyCode == 13) {
      this.quickSearch(evt);
    }
  };
  render() {
    let {
      isPublic,
      publicBooksHeader,
      publicName,
      anyActiveFilters,
      editTags,
      editSubjects,
      startSubjectModification,
      startTagModification,
      beginEditFilters,
      page,
      selectedBooksCount,
      totalPages
    } = this.props;
    let booksHeader = isPublic ? publicBooksHeader || `${publicName}'s Books` : "Your Books";

    let canPageUp = page < totalPages;
    let canPageDown = page > 1;
    let canPageOne = page > 1;
    let canPageLast = page < totalPages;

    let resultsCount = this.props.resultsCount;
    let resultsDisplay = resultsCount ? `${resultsCount} book${resultsCount === 1 ? "" : "s"}` : "";
    let removeAllFiltersLabel = {
      backgroundColor: "red",
      textColor: "white",
      name: "Remove all filters"
    };

    return (
      <div>
        <div className="booksMenuBar" style={{ fontSize: "11pt", paddingBottom: "5px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {isPublic ? <h4 style={{ marginTop: "5px", marginRight: "5px", marginBottom: 0, alignSelf: "center" }}>{booksHeader}</h4> : null}
            {!selectedBooksCount ? (
              <div className="visible-tiny" style={{ flex: "0 0 auto", marginTop: "5px", marginRight: "5px" }}>
                <div className="btn-group">
                  <button disabled={!canPageDown} className="btn btn-default">
                    <i className="fal fa-angle-left" />
                  </button>
                  <button disabled={!canPageUp} className="btn btn-default">
                    <i className="fal fa-angle-right" />
                  </button>
                </div>
              </div>
            ) : null}
            <div className="hidden-tiny" style={{ flex: "0 0 auto", marginTop: "5px", marginRight: "5px" }}>
              <div className="btn-group">
                <button disabled={!canPageOne} className="btn btn-default">
                  <i className="fal fa-angle-double-left" />
                </button>
                <button disabled={!canPageDown} className="btn btn-default" style={{ marginRight: "5px" }}>
                  <i className="fal fa-angle-left" />
                </button>
              </div>
              {resultsCount ? (
                <span style={{ display: "inline" }}>
                  <span className="hidden-xs">Page</span> {page}
                  <span className="hidden-xs"> of {totalPages}</span>
                </span>
              ) : null}
              <div className="btn-group">
                <button disabled={!canPageUp} className="btn btn-default" style={{ marginLeft: "5px" }}>
                  <i className="fal fa-angle-right" />
                </button>
                <button disabled={!canPageLast} className="btn btn-default">
                  <i className="fal fa-angle-double-right" />
                </button>
              </div>
            </div>
            <div style={{ flex: "0 0 auto", marginTop: "5px", marginRight: "5px" }}>
              <div className="btn-group">
                <input
                  ref={el => (this.quickSearchEl = el)}
                  defaultValue={this.props.search}
                  onBlur={this.resetSearch}
                  name="search"
                  className="form-control hidden-tiny"
                  placeholder="Title search"
                  onKeyDown={this.quickSearchType}
                  style={{
                    float: "left",
                    display: "inline-block",
                    width: "100px",
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderRightWidth: 0
                  }}
                />
                {!selectedBooksCount ? (
                  <>
                    <button
                      title="Filter search"
                      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      onClick={beginEditFilters}
                      className="btn btn-default btn-reset"
                    >
                      <i className="fal fa-filter" />
                    </button>
                    <button title="Edit subjects" onClick={editSubjects} className="btn btn-default ">
                      <i className="fal fa-sitemap" />
                    </button>
                    <button title="Edit tags" onClick={editTags} className="btn btn-default ">
                      <i className="fal fa-tags" />
                    </button>
                    <button onClick={this.props.setViewDesktop} className={"btn btn-default " + (this.props.isGridView ? "active" : "")}>
                      <i className="fal fa-table" />
                    </button>
                    <button onClick={this.props.setViewBasicList} className={"btn btn-default " + (this.props.isBasicList ? "active" : "")}>
                      <i className="fal fa-list" />
                    </button>
                  </>
                ) : (
                  <>
                    <button title="Add/remove subjects" onClick={startSubjectModification} className={"btn btn-default btn-reset"}>
                      <i className="fal fa-sitemap" />
                    </button>
                    <button title="Add/remove tags" onClick={startTagModification} className="btn btn-default">
                      <i className="fal fa-tags" />
                    </button>
                    <button title="Set read" onClick={this.props.setSelectedRead} className={"btn btn-default"}>
                      <i className="fal fa-eye" />
                    </button>
                    <button title="Set un-read" onClick={this.props.setSelectedUnRead} className="btn btn-default put-line-through">
                      <i className="fal fa-eye-slash" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div style={{ flex: "1 1 auto", display: "flex", alignItems: "flex-start", alignContent: "center", flexWrap: "wrap", marginTop: "5px" }}>
              {resultsCount ? (
                <div style={{ flex: "0 0 auto", marginRight: "5px", alignSelf: "center" }}>
                  <span className="visible-tiny">
                    Page {page} of {totalPages}
                    &nbsp;&nbsp;
                  </span>
                  {resultsDisplay}
                </div>
              ) : null}

              {this.props.selectedSubjects.map(s => (
                <RemovableLabelDisplay
                  style={{ flex: "0 0 auto", alignSelf: "center", marginRight: "5px", marginTop: "4px", marginBottom: "4px" }}
                  item={s}
                  doRemove={() => this.props.removeFilterSubject(s._id)}
                />
              ))}
              {this.props.selectedTags.map(t => (
                <RemovableLabelDisplay
                  style={{ flex: "0 0 auto", alignSelf: "center", marginRight: "5px", marginTop: "4px", marginBottom: "4px" }}
                  item={t}
                  doRemove={() => this.props.removeFilterTag(t._id)}
                />
              ))}
              {anyActiveFilters ? (
                <RemovableLabelDisplay
                  style={{ flex: "0 0 auto", alignSelf: "center", marginRight: "5px", marginTop: "4px", marginBottom: "4px" }}
                  item={removeAllFiltersLabel}
                  doRemove={this.props.clearAllFilters}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
