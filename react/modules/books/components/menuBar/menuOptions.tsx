import React, { useContext, FunctionComponent, useMemo } from "react";
import { AppContext, ModuleUpdateContext } from "app/renderUI";

import { BooksModuleContext } from "../../books";

const MenuOptions: FunctionComponent<{
  Button: any;
  selectedBooksCount: number;
  uiView: any;
  uiDispatch: any;
  bookResultsPacket: any;
}> = props => {
  const [appState] = useContext(AppContext);
  const { Button, selectedBooksCount, uiView, uiDispatch, bookResultsPacket } = props;

  let { isPublic, online } = appState;
  const { actions, booksUiState } = useContext(BooksModuleContext);
  const { setRead } = actions;

  const { selectedBooks } = booksUiState;
  const selectedBooksIds = useMemo(() => Object.keys(selectedBooks).filter(k => selectedBooks[k]), [selectedBooks]);

  const { books = [], reload } = bookResultsPacket || {};

  const editSubjectsForSelectedBooks = () => actions.openBookSubModal(books.filter(b => booksUiState.selectedBooks[b._id]));
  const editTagsForSelectedBooks = () => actions.openBookTagModal(books.filter(b => booksUiState.selectedBooks[b._id]));

  const { isPending: booksLoading, startTransition } = useContext(ModuleUpdateContext);
  const reloadBooks = () => {
    startTransition(reload);
  };

  return !selectedBooksCount ? (
    <>
      <hr />
      {online ? (
        <>
          <Button title="Filter search" onClick={actions.beginEditFilters} className="btn btn-default">
            <span>Set Filters</span>
            <i className="fal fa-filter" />
          </Button>
          <hr />
          {!isPublic ? (
            <>
              <Button title="Edit subjects" onClick={actions.editSubjects} className="btn btn-default">
                <span>Edit Subjects</span>
                <i className="fal fa-sitemap" />
              </Button>
              <Button title="Edit tags" onClick={actions.editTags} className="btn btn-default">
                <span>Edit Tags</span>
                <i className="fal fa-tags" />
              </Button>
              <hr />
            </>
          ) : null}
        </>
      ) : null}
      <Button className="btn btn-default" onClick={reloadBooks} disabled={booksLoading}>
        <span>Reload Books</span>
        <i className="fal fa-sync"></i>
      </Button>
      <hr />
      <Button onClick={() => uiDispatch({ type: "SET_GRID_VIEW" })} className={"btn btn-default" + (uiView.isGridView ? "active" : "")}>
        <span>Grid View</span>
        <i className="fal fa-table" />
      </Button>
      <Button onClick={() => uiDispatch({ type: "SET_COVERS_LIST_VIEW" })} className={"btn btn-default" + (uiView.isCoversList ? "active" : "")}>
        <span>Covers View</span>
        <i className="fas fa-th" />
      </Button>
      <Button onClick={() => uiDispatch({ type: "SET_BASIC_LIST_VIEW" })} className={"btn btn-default" + (uiView.isBasicList ? "active" : "")}>
        <span>Mobile View</span>
        <i className="fal fa-list" />
      </Button>
      <hr />
    </>
  ) : !isPublic ? (
    <>
      <hr />
      <Button title="Add/remove subjects" onClick={editSubjectsForSelectedBooks} className={"btn btn-default hidden-tiny"}>
        <span>Add / Remove Subjects</span>
        <i className="fal fa-sitemap" />
      </Button>
      <Button title="Add/remove tags" onClick={editTagsForSelectedBooks} className="btn btn-default hidden-tiny">
        <span>Add / Remove Tags</span>
        <i className="fal fa-tags" />
      </Button>
      <Button title="Set read" onClick={() => setRead(selectedBooksIds, true)} className={"btn btn-default hidden-tiny"}>
        <span>Set Read</span>
        <i className="fal fa-eye" />
      </Button>
      <Button title="Set un-read" onClick={() => setRead(selectedBooksIds, false)} className="btn btn-default put-line-through hidden-tiny">
        <span>Set Un-Read</span>
        <i className="fal fa-eye-slash" />
      </Button>
      <hr />
    </>
  ) : null;
};

export default MenuOptions;