import React, { Component } from "react";
import Loading from "applicationRoot/components/loading";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { BooksModuleType } from "modules/books/reducers/reducer";
import { selectBookList } from "modules/books/reducers/books/reducer";

const selector = createSelector(
  (state: BooksModuleType) => state.app,
  selectBookList,
  (app, booksList) => {
    return {
      subjectsLoaded: app.subjectsLoaded,
      tagsLoaded: app.tagsLoaded,
      booksLoading: booksList.booksLoading
    };
  }
);

class BooksLoading extends Component<Partial<ReturnType<typeof selector>>, any> {
  render() {
    return this.props.booksLoading || !this.props.subjectsLoaded ? <Loading /> : null;
  }
}

export default connect(selector)(BooksLoading);
