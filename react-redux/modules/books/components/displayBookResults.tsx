import React, { SFC, Suspense, lazy } from "react";
import GridView from "./bookViewList-grid";

import { connect } from "react-redux";
import { createSelector } from "reselect";

import { BooksModuleType } from "modules/books/reducers/reducer";
import { selectBookSearchUiView } from "modules/books/reducers/bookSearch/reducer";

import Loading from "applicationRoot/components/loading";

const BasicListView: any = lazy(() => import(/* webpackChunkName: "basic-view-list" */ "./bookViewList-basicList"));

type PassedIn = { editBook: any; editTagsForBook: any; editSubjectsForBook: any };

const selector = createSelector(
  (state: BooksModuleType) => state.app,
  selectBookSearchUiView,
  (app, ui) => {
    return {
      subjectsLoaded: app.subjectsLoaded,
      tagsLoaded: app.tagsLoaded,
      ...ui
    };
  }
);

const DisplayBookResults: SFC<PassedIn & ReturnType<typeof selector>> = props => {
  let { editBook, editTagsForBook, editSubjectsForBook } = props;

  return props.subjectsLoaded && props.tagsLoaded ? (
    props.isGridView ? (
      <GridView editBook={editBook} editBooksTags={editTagsForBook} editBooksSubjects={editSubjectsForBook} />
    ) : props.isBasicList ? (
      <Suspense fallback={<Loading />}>
        <BasicListView editBook={editBook} />
      </Suspense>
    ) : null
  ) : null;
};

export default connect(selector)(DisplayBookResults);
