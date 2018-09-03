import React, { Component } from "react";
import { connect } from "react-redux";

import NavBar from "simple-react-bootstrap/lib/navBar";

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
type BookUtilMenuOptionsType = ReturnType<typeof selectBookSelection> & ReturnType<typeof selectAppUiState>;

const menuBarSelector = combineSelectors<BookMenuBarType>(
  selectBookSearchState,
  selectBookSearchUiView,
  selectBookLoadingInfo,
  selectAppUiState,
  selectBookSelection
);
const utilMenuOptionsSelector = combineSelectors<BookUtilMenuOptionsType>(selectBookSelection, selectAppUiState);

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
    let selectedSubjectsCount = this.props.selectedSubjects.length;
    let selectedTagsCount = this.props.selectedTags.length;

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
      selectedBooksCount
    } = this.props;
    let booksHeader = isPublic ? publicBooksHeader || `${publicName}'s Books` : "Your Books";

    //TODO:
    let pages = 1;

    let canPageUp = page < pages;
    let canPageDown = page > 1;
    let canPageOne = page > 1;
    let canPageLast = page < pages;

    let resultsCount = this.props.resultsCount;
    let resultsDisplay = resultsCount ? `${resultsCount} book${resultsCount === 1 ? "" : "s"}` : "";
    let removeAllFiltersLabel = {
      backgroundColor: "red",
      textColor: "white",
      name: "Remove all filters"
    };

    return (
      <div style={{ zIndex: 499, backgroundColor: "white" }}>
        <div className="booksMenuBar" style={{ fontSize: "11pt", paddingLeft: "5px", paddingBottom: "5px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 auto", marginTop: "5px", marginRight: "5px" }}>
              <div className="btn-group">
                <button disabled={!canPageOne} type="button" className="btn btn-default">
                  <i className="fal fa-angle-double-left" />
                </button>
                <button disabled={!canPageDown} type="button" className="btn btn-default" style={{ marginRight: "5px" }}>
                  <i className="fal fa-angle-left" />
                </button>
              </div>
              {resultsCount ? (
                <span style={{ display: "inline" }}>
                  <span className="hidden-xs">Page</span> {page}
                  <span className="hidden-xs"> of {pages}</span>
                </span>
              ) : null}
              <div className="btn-group">
                <button disabled={!canPageUp} type="button" className="btn btn-default" style={{ marginLeft: "5px" }}>
                  <i className="fal fa-angle-right" />
                </button>
                <button disabled={!canPageLast} type="button" className="btn btn-default">
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
                  className="form-control"
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
                      type="button"
                      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      onClick={beginEditFilters}
                      className="btn btn-default"
                    >
                      <i className="fal fa-filter" />
                    </button>
                    <button
                      type="button"
                      onClick={this.props.setViewDesktop}
                      className={"btn btn-default " + (this.props.isGridView ? "active" : "")}
                    >
                      <i className="fal fa-table" />
                    </button>
                    <button
                      type="button"
                      onClick={this.props.setViewBasicList}
                      className={"btn btn-default " + (this.props.isBasicList ? "active" : "")}
                    >
                      <i className="fal fa-list" />
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={this.props.startSubjectModification} className={"btn btn-default"}>
                      <i className="fal fa-sitemap" />
                    </button>
                    <button type="button" onClick={this.props.startTagModification} className="btn btn-default">
                      <i className="fal fa-tags" />
                    </button>
                    <button type="button" onClick={this.props.setSelectedRead} className={"btn btn-default"}>
                      <i className="fal fa-eye" />
                    </button>
                    <button type="button" onClick={this.props.setSelectedUnRead} className="btn btn-default put-line-through">
                      <i className="fal fa-eye-slash" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div style={{ flex: "1 1 auto", display: "flex", alignItems: "flex-start", alignContent: "center", flexWrap: "wrap", marginTop: "5px" }}>
              {resultsCount ? <div style={{ flex: "0 0 auto", marginRight: "5px", alignSelf: "center" }}>{resultsDisplay}</div> : null}

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

type UtilMenuOptionsComponentType = BookUtilMenuOptionsType &
  typeof booksActionCreators & { editTags: any; editSubjects: any; startSubjectModification: any; startTagModification: any };
@connect(
  utilMenuOptionsSelector,
  { ...booksActionCreators }
)
class UtilMenuOptions extends Component<UtilMenuOptionsComponentType, any> {
  render() {
    return (
      <NavBar.Nav>
        <NavBar.Dropdown disabled={this.props.isPublic} text="Admin">
          <NavBar.Item onClick={this.props.editSubjects}>Edit subjects</NavBar.Item>
          <NavBar.Item onClick={this.props.editTags}>Edit tags</NavBar.Item>
        </NavBar.Dropdown>

        <NavBar.Dropdown disabled={!this.props.selectedBooksCount || this.props.isPublic} text="Selected books" style={{ marginRight: "5px" }}>
          <NavBar.Item onClick={this.props.startSubjectModification}>Set subjects</NavBar.Item>
          <NavBar.Item onClick={this.props.startTagModification}>Set tags</NavBar.Item>
          <NavBar.Item onClick={this.props.setSelectedRead}>Set all read</NavBar.Item>
          <NavBar.Item onClick={this.props.setSelectedUnRead}>Set all un-read</NavBar.Item>
        </NavBar.Dropdown>
      </NavBar.Nav>
    );
  }
}
