import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { connect } from "react-redux";
import NavBar from "simple-react-bootstrap/lib/navBar";

import { BootstrapAnchorButton } from "applicationRoot/components/bootstrapButton";

import { selectBookSelection, BookSelectionType, BookLoadingType, selectBookLoadingInfo } from "modules/books/reducers/books/reducer";
import { BookSearchState, selectBookSearchState, selectBookSearchUiView, BookSearchUiViewType } from "modules/books/reducers/bookSearch/reducer";

import * as booksActionCreators from "../reducers/books/actionCreators";
import * as bookSearchActionCreators from "../reducers/bookSearch/actionCreators";
import * as subjectsActionCreators from "../reducers/subjects/actionCreators";
import * as tagsActionCreators from "../reducers/tags/actionCreators";

import { RemovableLabelDisplay } from "applicationRoot/components/labelDisplay";

import { BooksModuleType } from "modules/books/reducers/reducer";
import Measure from "react-measure";
import { AppUiState, selectAppUiState, combineSelectors } from "applicationRoot/rootReducer";

type BookMenuBarType = BookSearchState & BookLoadingType & BookSearchUiViewType & AppUiState;
type BookUtilMenuOptionsType = BookSelectionType & AppUiState;

const menuBarSelector = combineSelectors<BookMenuBarType>(selectBookSearchState, selectBookSearchUiView, selectBookLoadingInfo, selectAppUiState);
const utilMenuOptionsSelector = combineSelectors<BookUtilMenuOptionsType>(selectBookSelection, selectAppUiState);

interface IAddedMenuProps {
  navBarSized: Function;
  editTags: any;
  editSubjects: any;
  startSubjectModification: any;
  startTagModification: any;
  beginEditFilters: any;
}

@connect(menuBarSelector, { ...bookSearchActionCreators })
export default class BooksMenuBar extends Component<BookMenuBarType & typeof bookSearchActionCreators & IAddedMenuProps, any> {
  navBar: any;
  quickSearchEl: any;
  sortChanged(evt) {
    let value = evt.target.value,
      [sort, direction] = value.split("|");

    this.props.setSortOrder(sort, direction == "asc" ? 1 : 0);
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.booksLoading && this.props.booksLoading) {
      this.navBar.closeIfOpen();
    }
    if (prevProps.search != this.props.search) {
      this.quickSearchEl && (this.quickSearchEl.value = this.props.search);
    }
  }
  quickSearch = evt => {
    evt.preventDefault();
    this.props.quickSearch(evt.currentTarget.search.value);
  };
  resetSearch = () => {
    this.quickSearchEl.value = this.props.search;
  };
  render() {
    let selectedSubjectsCount = this.props.selectedSubjects.length,
      selectedTagsCount = this.props.selectedTags.length,
      selectedSubjectsHeader = "Searching " + selectedSubjectsCount + " Subject" + (selectedSubjectsCount === 1 ? "" : "s"),
      selectedTagsHeader = "Searching " + selectedTagsCount + " Tag" + (selectedTagsCount === 1 ? "" : "s");

    let {
      isPublic,
      publicBooksHeader,
      publicName,
      anyActiveFilters,
      editTags,
      editSubjects,
      startSubjectModification,
      startTagModification,
      beginEditFilters
    } = this.props;
    let booksHeader = isPublic ? publicBooksHeader || `${publicName}'s Books` : "Your Books";

    let UtilMenu: any = UtilMenuOptions,
      resultsCount = this.props.resultsCount,
      resultsDisplay = resultsCount ? `${resultsCount} book${resultsCount === 1 ? "" : "s"} found` : "",
      removeAllFiltersLabel = {
        backgroundColor: "red",
        textColor: "white",
        name: "Remove all filters"
      };

    return (
      <Measure client={true} onResize={this.props.navBarSized}>
        {({ measureRef }) => (
          <div ref={measureRef} style={{ position: "sticky", top: 50, zIndex: 499 }}>
            <NavBar ref={el => (this.navBar = el)} style={{ border: 0, borderRadius: 0 }}>
              <NavBar.Header>
                <NavBar.Brand>
                  <a style={{ cursor: "default" }}>{booksHeader}</a>
                </NavBar.Brand>
                <NavBar.Toggle />
              </NavBar.Header>
              <UtilMenu
                startSubjectModification={startSubjectModification}
                startTagModification={startTagModification}
                editSubjects={editSubjects}
                editTags={editTags}
              />
              <div className="navbar-left navbar-form">
                <div className="form-group" style={{ marginRight: "5px" }}>
                  {this.props.showingMobile ? (
                    <div>
                      <BootstrapAnchorButton style={{ width: "100%" }} className="margin-bottom" preset="default" onClick={beginEditFilters}>
                        Open full search modal
                      </BootstrapAnchorButton>

                      <form onSubmit={this.quickSearch}>
                        <input
                          ref={el => (this.quickSearchEl = el)}
                          defaultValue={this.props.search}
                          onBlur={this.resetSearch}
                          name="search"
                          className="margin-bottom form-control"
                          placeholder="Quick title search"
                        />
                      </form>

                      <select value={this.props.bindableSortValue} onChange={evt => this.sortChanged(evt)} className="form-control margin-bottom">
                        <option value="title|asc">Title A-Z</option>
                        <option value="title|desc">Title Z-A</option>
                        <option value="pages|asc">Pages, Low</option>
                        <option value="pages|desc">Pages, High</option>
                        <option value="_id|asc">Created, Earliest</option>
                        <option value="_id|desc">Created, Latest</option>
                      </select>
                    </div>
                  ) : (
                    <form onSubmit={this.quickSearch}>
                      <div className="input-group">
                        <span className="input-group-btn">
                          <BootstrapAnchorButton preset="default" onClick={beginEditFilters}>
                            Filter
                          </BootstrapAnchorButton>
                        </span>
                        <input
                          ref={el => (this.quickSearchEl = el)}
                          defaultValue={this.props.search}
                          onBlur={this.resetSearch}
                          name="search"
                          className="form-control"
                          placeholder="Quick title search"
                          style={{ width: "150px" }}
                        />
                      </div>
                    </form>
                  )}
                </div>

                {this.props.showingDesktop ? (
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      onClick={this.props.setViewDesktop}
                      className={"btn btn-default " + (this.props.isGridView ? "active" : "")}
                    >
                      <i className="fa fa-fw fa-table" />
                    </button>
                    <button
                      type="button"
                      onClick={this.props.setViewBasicList}
                      className={"btn btn-default " + (this.props.isBasicList ? "active" : "")}
                    >
                      <i className="fa fa-fw fa-list" />
                    </button>
                    {0 ? (
                      <button type="button" className="btn btn-default">
                        <i className="fa fa-fw fa-th" />
                      </button>
                    ) : null}
                  </div>
                ) : null}
                {resultsCount ? <h5 style={{ display: "inline", marginLeft: "10px", verticalAlign: "middle" }}>{resultsDisplay}</h5> : null}
              </div>

              {anyActiveFilters && this.props.showingDesktop ? (
                <NavBar.Nav>
                  <NavBar.Dropdown keepOpenIfItemClickedNoLongerInDocument={true} ignoreContentClick={true} text={"Quick filters"}>
                    {selectedSubjectsCount ? (
                      <li style={{ padding: "3px 20px" }}>
                        <span>Subjects</span>
                      </li>
                    ) : null}

                    {this.props.selectedSubjects.map(s => (
                      <li style={{ padding: "3px 20px" }} className="default-cursor no-hover" key={s._id}>
                        <RemovableLabelDisplay item={s} doRemove={() => this.props.removeFilterSubject(s._id)} />
                      </li>
                    ))}

                    {!!this.props.searchChildSubjects ? <NavBar.ItemDivider /> : null}
                    {!!this.props.searchChildSubjects ? (
                      <li style={{ paddingLeft: "20px", paddingRight: "20px", marginTop: "-5px" }} className="default-cursor no-hover">
                        <span style={{ color: "white" }} className={"label label-primary"}>
                          <a onClick={this.props.clearSearchChildSubjects} style={{ color: "white", cursor: "pointer" }}>
                            X
                          </a>
                          <span style={{ marginLeft: 5, paddingLeft: 5, borderLeft: "1px solid white" }}>Searching child subjects</span>
                        </span>
                      </li>
                    ) : null}
                    {selectedSubjectsCount && selectedTagsCount ? <NavBar.ItemDivider /> : null}
                    {selectedTagsCount ? (
                      <li style={{ padding: "3px 20px" }}>
                        <span>Tags</span>
                      </li>
                    ) : null}
                    {this.props.selectedTags.map(t => (
                      <li style={{ padding: "3px 20px" }} className="default-cursor no-hover" key={t._id}>
                        <RemovableLabelDisplay item={t} doRemove={() => this.props.removeFilterTag(t._id)} />
                      </li>
                    ))}

                    {selectedSubjectsCount || selectedTagsCount ? <NavBar.ItemDivider /> : null}
                    <li style={{ padding: "3px 20px" }} className="default-cursor no-hover" key={-1}>
                      <RemovableLabelDisplay item={removeAllFiltersLabel} doRemove={this.props.clearAllFilters} />
                    </li>

                    <li style={{ height: "5px" }} />
                  </NavBar.Dropdown>
                </NavBar.Nav>
              ) : null}
            </NavBar>
          </div>
        )}
      </Measure>
    );
  }
}

type UtilMenuOptionsComponentType = BookUtilMenuOptionsType &
  typeof booksActionCreators & { editTags: any; editSubjects: any; startSubjectModification: any; startTagModification: any };
@connect(utilMenuOptionsSelector, { ...booksActionCreators })
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
