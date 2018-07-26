import React, { Component } from "react";
import Loading from "applicationRoot/components/loading";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { BooksModuleType } from "modules/books/reducers/reducer";
import { selectBookList } from "modules/books/reducers/books/reducer";

const selector = createSelector(
  (state: BooksModuleType) => state.app,
  (state: BooksModuleType) => state.booksModule.tags,
  selectBookList,
  (app, tags, booksList) => {
    return {
      subjectsLoaded: app.subjectsLoaded,
      tagsLoaded: tags.loaded,
      booksLoading: booksList.booksLoading
    };
  }
);

@connect(selector)
export default class BooksLoading extends Component<Opt<ReturnType<typeof selector>>, any> {
  render() {
    return this.props.booksLoading || !this.props.subjectsLoaded || !this.props.tagsLoaded ? <Loading /> : null;
  }
}
