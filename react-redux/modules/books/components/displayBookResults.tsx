import React, { Component } from "react";

import GV from "./bookViewList-grid";
const GridView: any = GV;

import BLV from "./bookViewList-basicList";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { BooksModuleType, AppType, BookSearchType, TagsType } from "modules/books/reducers/reducer";
import { selectBookList } from "modules/books/reducers/books/reducer";
import { selectBookSearchUiView } from "modules/books/reducers/bookSearch/reducer";

const BasicListView: any = BLV;

type PassedIn = { editBook: any; editTagsForBook: any; editSubjectsForBook: any; navBarHeight: any };

const selector = createSelector(
  (state: BooksModuleType) => state.app,
  (state: BooksModuleType) => state.booksModule.tags,
  selectBookSearchUiView,
  (app, tags, ui) => {
    return {
      subjectsLoaded: app.subjectsLoaded,
      tagsLoaded: tags.loaded,
      ...ui
    };
  }
);

@connect(selector)
export default class DisplayBookResults extends Component<PassedIn & ReturnType<typeof selector>, null> {
  render() {
    let { editBook, editTagsForBook, editSubjectsForBook, navBarHeight } = this.props;

    return this.props.subjectsLoaded && this.props.tagsLoaded ? (
      this.props.isGridView ? (
        <GridView editBook={editBook} editBooksTags={editTagsForBook} editBooksSubjects={editSubjectsForBook} navBarHeight={navBarHeight} />
      ) : this.props.isBasicList ? (
        <BasicListView editBook={editBook} />
      ) : null
    ) : null;
  }
}
