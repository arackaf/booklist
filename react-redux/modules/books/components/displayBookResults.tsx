import React, { Component } from "react";

import GV from "./bookViewList-grid";
const GridView: any = GV;

import { connect } from "react-redux";
import { createSelector } from "reselect";

import { BooksModuleType } from "modules/books/reducers/reducer";
import { selectBookSearchUiView } from "modules/books/reducers/bookSearch/reducer";

import Loadable from "react-loadable";
import ComponentLoading from "applicationRoot/components/componentLoading";

const BasicListView = Loadable({
  loader: () => System.import(/* webpackChunkName: "basic-view-list" */ "./bookViewList-basicList"),
  loading: ComponentLoading,
  delay: 200
});

type PassedIn = { editBook: any; editTagsForBook: any; editSubjectsForBook: any };

const selector = createSelector((state: BooksModuleType) => state.app, selectBookSearchUiView, (app, ui) => {
  return {
    subjectsLoaded: app.subjectsLoaded,
    tagsLoaded: app.tagsLoaded,
    ...ui
  };
});

@connect(selector)
export default class DisplayBookResults extends Component<PassedIn & ReturnType<typeof selector>, null> {
  render() {
    let { editBook, editTagsForBook, editSubjectsForBook } = this.props;

    return this.props.subjectsLoaded && this.props.tagsLoaded ? (
      this.props.isGridView ? (
        <GridView editBook={editBook} editBooksTags={editTagsForBook} editBooksSubjects={editSubjectsForBook} />
      ) : this.props.isBasicList ? (
        <BasicListView editBook={editBook} />
      ) : null
    ) : null;
  }
}
