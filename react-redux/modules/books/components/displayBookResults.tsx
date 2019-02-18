import React, { Suspense, lazy, FunctionComponent } from "react";
import GridView from "./bookViewList-grid";

import Loading from "applicationRoot/components/loading";
import { useBookSearchUiView } from "../booksSearchState";

const BasicListView: any = lazy(() => import(/* webpackChunkName: "basic-view-list" */ "./bookViewList-basicList"));

const DisplayBookResults: FunctionComponent<{ editBook: any; editTagsForBook: any; editSubjectsForBook: any }> = props => {
  const { editBook, editTagsForBook, editSubjectsForBook } = props;
  const uiView = useBookSearchUiView();

  return uiView.isGridView ? (
    <GridView editBook={editBook} editBooksTags={editTagsForBook} editBooksSubjects={editSubjectsForBook} />
  ) : uiView.isBasicList ? (
    <Suspense fallback={<Loading />}>
      <BasicListView editBook={editBook} />
    </Suspense>
  ) : null;
};

export default DisplayBookResults;
