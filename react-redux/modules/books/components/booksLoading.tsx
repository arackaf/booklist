import React, { Component } from "react";
import Loading from "applicationRoot/components/loading";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { BooksModuleType, AppType, BookSearchType, TagsType } from "modules/books/reducers/reducer";
import { selectBookList, BookListType } from "modules/books/reducers/books/reducer";

type SelectedType = { subjectsLoaded?: boolean; tagsLoaded?: boolean; booksLoading?: boolean };

const selector = createSelector<BooksModuleType, SelectedType, AppType, TagsType, BookListType>(
  state => state.app,
  state => state.booksModule.tags,
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
export default class BooksLoading extends Component<SelectedType, any> {
  render() {
    return this.props.booksLoading || !this.props.subjectsLoaded || !this.props.tagsLoaded ? <Loading /> : null;
  }
}
