import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "simple-react-bootstrap/lib/navBar";

import { BootstrapAnchorButton } from "applicationRoot/components/bootstrapButton";

import { selectBookSelection, selectBookLoadingInfo } from "modules/books/reducers/books/reducer";
import { selectBookSearchState, selectBookSearchUiView } from "modules/books/reducers/bookSearch/reducer";

import * as booksActionCreators from "../reducers/books/actionCreators";
import * as bookSearchActionCreators from "../reducers/bookSearch/actionCreators";

import { RemovableLabelDisplay } from "applicationRoot/components/labelDisplay";

import { selectAppUiState, combineSelectors } from "applicationRoot/rootReducer";

type BookMenuBarType = ReturnType<typeof selectBookSearchState> &
  ReturnType<typeof selectBookLoadingInfo> &
  ReturnType<typeof selectBookSearchUiView> &
  ReturnType<typeof selectAppUiState>;
type BookUtilMenuOptionsType = ReturnType<typeof selectBookSelection> & ReturnType<typeof selectAppUiState>;

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

@connect(
  menuBarSelector,
  { ...bookSearchActionCreators }
)
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
      page
    } = this.props;
    let booksHeader = isPublic ? publicBooksHeader || `${publicName}'s Books` : "Your Books";

    //TODO:
    let pages = 1;

    let canPageUp = page < pages;
    let canPageDown = page > 1;
    let canPageOne = page > 1;
    let canPageLast = page < pages;

    let UtilMenu: any = UtilMenuOptions,
      resultsCount = this.props.resultsCount,
      resultsDisplay = resultsCount ? `${resultsCount} book${resultsCount === 1 ? "" : "s"}` : "",
      removeAllFiltersLabel = {
        backgroundColor: "red",
        textColor: "white",
        name: "Remove all filters"
      };

    return (
      <div style={{ position: "sticky", top: 50, zIndex: 499 }}>
        <div className="booksMenuBar" style={{ fontSize: "11pt", padding: "5px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <div style={{ flex: "0 0 auto" }}>
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
                  Page {page} of {pages}
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

              {resultsCount ? <span style={{ display: "inline", marginLeft: "3px" }}>{resultsDisplay}</span> : null}
            </div>
            <div style={{ flex: "0 0 300px" }}>
              <div className="input-group" style={{ display: "block" }}>
                <input
                  ref={el => (this.quickSearchEl = el)}
                  defaultValue={this.props.search}
                  onBlur={this.resetSearch}
                  name="search"
                  className="form-control"
                  placeholder="Title search"
                  style={{ width: "100px", borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0 }}
                />

                <div className="input-group-addon">
                  <div className="btn-group">
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
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: "1 1 auto" }}>HEllo</div>
          </div>
        </div>
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
