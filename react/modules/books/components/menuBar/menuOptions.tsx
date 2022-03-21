import React, { useContext, FunctionComponent, useMemo } from "react";
import { AppContext, ModuleUpdateContext } from "app/state/appState";

import { BooksModuleContext } from "../../booksState";

const MenuOptions: FunctionComponent<{
  Button: any;
  selectedBooksCount: number;
  uiView: any;
  uiDispatch: any;
  bookResultsPacket: any;
  setMobileMenuOpen?: (val: boolean) => void;
}> = props => {
  const [appState] = useContext(AppContext);
  const { Button, selectedBooksCount, uiView, uiDispatch, bookResultsPacket, setMobileMenuOpen } = props;

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

  const mobileHandler =
    (fn: () => unknown, delay = false) =>
    () => {
      setTimeout(
        () => {
          setMobileMenuOpen?.(false);
        },
        delay ? 300 : 0
      );
      fn();
    };

  return !selectedBooksCount ? (
    <>
      <hr />
      {online ? (
        <>
          <Button title="Filter search" onClick={mobileHandler(actions.beginEditFilters, true)} className="btn btn-default">
            <span>Set Filters</span>
            <i className="fal fa-fw fa-filter" />
          </Button>
          <hr />
          {!isPublic ? (
            <>
              <Button title="Edit subjects" onClick={mobileHandler(actions.editSubjects, true)} className="btn btn-default">
                <span>Edit Subjects</span>
                <i className="fal fa-fw fa-sitemap" />
              </Button>
              <Button title="Edit tags" onClick={mobileHandler(actions.editTags, true)} className="btn btn-default">
                <span>Edit Tags</span>
                <i className="fal fa-fw fa-tags" />
              </Button>
              <hr />
            </>
          ) : null}
        </>
      ) : null}
      <Button className="btn btn-default" onClick={mobileHandler(reloadBooks)} disabled={booksLoading}>
        <span>Reload Books</span>
        <i className="fal fa-fw fa-sync"></i>
      </Button>
      <hr />
      <Button
        onClick={mobileHandler(() => uiDispatch({ type: "SET_GRID_VIEW" }))}
        className={"btn btn-default " + (uiView.isGridView ? "active" : "")}
      >
        <span>Main View</span>
        <i className="fal fa-fw fa-table" />
      </Button>
      <Button
        onClick={mobileHandler(() => uiDispatch({ type: "SET_COVERS_LIST_VIEW" }))}
        className={"btn btn-default " + (uiView.isCoversList ? "active" : "")}
      >
        <span>Covers View</span>
        <i className="fas fa-fw fa-th" />
      </Button>
      <Button
        onClick={mobileHandler(() => uiDispatch({ type: "SET_BASIC_LIST_VIEW" }))}
        className={"btn btn-default " + (uiView.isBasicList ? "active" : "")}
      >
        <span>Mobile View</span>
        <i className="fal fa-fw fa-list" />
      </Button>
      <hr />
    </>
  ) : !isPublic ? (
    <>
      <hr />
      <Button title="Add/remove subjects" onClick={mobileHandler(editSubjectsForSelectedBooks)} className={"btn btn-default"}>
        <span>Add / Remove Subjects</span>
        <i className="fal fa-fw fa-sitemap" />
      </Button>
      <Button title="Add/remove tags" onClick={mobileHandler(editTagsForSelectedBooks)} className="btn btn-default">
        <span>Add / Remove Tags</span>
        <i className="fal fa-fw fa-tags" />
      </Button>
      <Button title="Set read" onClick={mobileHandler(() => setRead(selectedBooksIds, true))} className={"btn btn-default"}>
        <span>Set Read</span>
        <i className="fal fa-fw fa-eye" />
      </Button>
      <Button title="Set un-read" onClick={mobileHandler(() => setRead(selectedBooksIds, false))} className="btn btn-default put-line-through">
        <span>Set Un-Read</span>
        <i className="fal fa-fw fa-eye-slash" />
      </Button>
      <hr />
    </>
  ) : null;
};

export default MenuOptions;
