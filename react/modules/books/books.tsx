import React, { SFC, Suspense, useEffect, useLayoutEffect, useReducer, useContext, createContext, useState } from "react";

import BooksMenuBar, { BooksMenuBarDisabled } from "./components/booksMenuBar";
import Loading from "app/components/loading";

import GridView, { GridViewShell } from "./components/bookViews/gridList";
import LazyModal from "app/components/ui/LazyModal";

import BasicListView from "./components/bookViews/basicList";
import CoversView from "./components/bookViews/coversList";

import { useBooks } from "./booksState";
import { useMutation } from "micro-graphql-react";
import { useCodeSplitModal } from "./util";

import UpdateBookMutation from "graphQL/books/updateBook.graphql";
import UpdateBooksReadMutation from "graphQL/books/updateBooksRead.graphql";
import DeleteBookMutation from "graphQL/books/deleteBook.graphql";
import { MutationOf, Mutations } from "graphql-typings";
import { useBookSearchUiView, BookSearchUiView } from "./booksUiState";
import { ModuleUpdateContext } from "app/renderUI";

const CreateBookModal = LazyModal(() => import(/* webpackChunkName: "book-view-edit-modals" */ "app/components/editBook/editModal"));
const BookSubjectSetter = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/bookSubjectSetter"));
const BookTagSetter = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/bookTagSetter"));
const SubjectEditModal = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/subjectEditModal"));
const TagEditModal = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/tagEditModal"));
const BookSearchModal = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/bookSearchModal"));

const prepBookForSaving = book => {
  let propsToUpdate = ["title", "isbn", "smallImage", "pages", "publisher", "publicationDate", "authors", "subjects", "tags"];
  let pages = parseInt(book.pages, 10);
  book.pages = isNaN(pages) ? void 0 : pages;

  return propsToUpdate.reduce((obj, prop) => ((obj[prop] = book[prop]), obj), {});
};

export type BooksModuleActions = {
  editBook: any;
  saveEditingBook: any;
  openBookSubModal: any;
  openBookTagModal: any;
  editTags: any;
  editSubjects: any;
  beginEditFilters: any;
  setRead: any;
  runDelete: any;
};

const initialBooksState = { selectedBooks: {}, savingReadForBooks: {}, pendingDelete: {}, deleting: {} };

export type BooksModuleData = {
  actions: BooksModuleActions;
  booksUiState: typeof initialBooksState;
  dispatchBooksUiState: any;
};

export const BooksModuleContext = createContext<BooksModuleData>(null);

const keysToHash = (_ids, value) => (Array.isArray(_ids) ? _ids : [_ids]).reduce((o, _id) => ((o[_id] = value), o), {});

function booksUiStateReducer(state, [action, payload = null]) {
  switch (action) {
    case "select":
      return { ...state, selectedBooks: { ...state.selectedBooks, ...keysToHash(payload, true) } };
    case "de-select":
      return { ...state, selectedBooks: { ...state.selectedBooks, ...keysToHash(payload, false) } };
    case "toggle-select":
      return { ...state, selectedBooks: { ...state.selectedBooks, [payload]: !state.selectedBooks[payload] } };
    case "start-delete":
      return { ...state, pendingDelete: { ...state.pendingDelete, ...keysToHash(payload, true) } };
    case "cancel-delete":
      return { ...state, pendingDelete: { ...state.pendingDelete, ...keysToHash(payload, false) } };
    case "delete":
      return { ...state, deleting: { ...state.deleting, [payload]: true } };
    case "reset":
      return { ...initialBooksState };
    default:
      throw "Invalid key";
  }
}

export default () => {
  const [tagEditModalOpen, editTags, stopEditingTags] = useCodeSplitModal();
  const [subjectEditModalOpen, editSubjects, stopEditingSubjects] = useCodeSplitModal();
  const [editingFilters, beginEditFilters, endEditFilters] = useCodeSplitModal();

  const [bookSubModifying, openBookSubModal, closeBookSubModal] = useCodeSplitModal(null);
  const [bookTagModifying, openBookTagModal, closeBookTagModal] = useCodeSplitModal(null);

  const [editingBook, openBookEditModal, stopEditingBook] = useCodeSplitModal(null);
  const editBook = book => openBookEditModal(book);

  const { runMutation, running } = useMutation<MutationOf<Mutations["updateBook"]>>(UpdateBookMutation);

  const saveEditingBook = book => {
    let bookToUse = prepBookForSaving(book);
    return Promise.resolve(runMutation({ _id: book._id, book: bookToUse })).then(resp => {
      stopEditingBook();
    });
  };

  const { runMutation: setReadStatus } = useMutation<MutationOf<Mutations["updateBooks"]>>(UpdateBooksReadMutation);
  const { runMutation: deleteBook } = useMutation<MutationOf<Mutations["deleteBook"]>>(DeleteBookMutation);

  const [booksUiState, dispatchBooksUiState] = useReducer(booksUiStateReducer, initialBooksState);

  const setRead = (_ids, isRead) => Promise.resolve(setReadStatus({ _ids, isRead }));

  const runDelete = _id => {
    dispatchBooksUiState(["delete", _id]);
    return deleteBook({ _id });
  };

  const actions = { editTags, editSubjects, beginEditFilters, openBookSubModal, openBookTagModal, saveEditingBook, editBook, setRead, runDelete };

  return (
    <div style={{}}>
      <BooksModuleContext.Provider value={{ actions, booksUiState, dispatchBooksUiState }}>
        <RenderModule />

        <Suspense fallback={<Loading />}>
          <SubjectEditModal isOpen={subjectEditModalOpen} editModalOpen={subjectEditModalOpen} stopEditing={stopEditingSubjects} />
          <TagEditModal isOpen={tagEditModalOpen} editModalOpen={tagEditModalOpen} onDone={stopEditingTags} />
          <BookSearchModal isOpen={editingFilters} onHide={endEditFilters} />

          <BookSubjectSetter isOpen={bookSubModifying} modifyingBooks={bookSubModifying} onDone={closeBookSubModal} />
          <BookTagSetter isOpen={bookTagModifying} modifyingBooks={bookTagModifying} onDone={closeBookTagModal} />

          <CreateBookModal
            title={editingBook ? `Edit ${editingBook.title}` : ""}
            bookToEdit={editingBook}
            isOpen={!!editingBook}
            saveBook={saveEditingBook}
            saveMessage={"Saved"}
            onClosing={stopEditingBook}
          />
        </Suspense>
      </BooksModuleContext.Provider>
    </div>
  );
};

const Fallback: SFC<{ uiView: BookSearchUiView; totalPages: number; resultsCount: number }> = ({ uiView, totalPages, resultsCount }) => {
  return (
    <>
      <BooksMenuBarDisabled totalPages={totalPages} resultsCount={resultsCount} />
      {uiView.isGridView ? (
        <GridViewShell />
      ) : (
        <h1 style={{ color: "var(--neutral-5)" }}>
          Books are loading <i className="fas fa-cog fa-spin"></i>
        </h1>
      )}
    </>
  );
};

const RenderModule: SFC<{}> = ({}) => {
  const uiView = useBookSearchUiView();
  const [lastBookResults, setLastBookResults] = useState({ totalPages: 0, resultsCount: 0 });

  return (
    <div className="standard-module-container margin-bottom-lg">
      <Suspense fallback={<Fallback uiView={uiView} {...lastBookResults} />}>
        <MainContent uiView={uiView} setLastBookResults={setLastBookResults} />
      </Suspense>
    </div>
  );
};

const MainContent: SFC<{ uiView: BookSearchUiView; setLastBookResults: any }> = ({ uiView, setLastBookResults }) => {
  const { books, totalPages, resultsCount, currentQuery } = useBooks();
  const { dispatchBooksUiState } = useContext(BooksModuleContext);

  // TODO: useEffect pending https://github.com/facebook/react/issues/17911#issuecomment-581969701
  //useLayoutEffect(() => dispatchBooksUiState(["reset"]), [currentQuery]);
  useEffect(() => dispatchBooksUiState(["reset"]), [currentQuery]);

  useEffect(() => {
    setLastBookResults({ resultsCount, totalPages });
  }, [resultsCount, totalPages]);

  const { dispatch: uiDispatch } = uiView;

  return (
    <>
      <BooksMenuBar uiDispatch={uiDispatch} uiView={uiView} bookResultsPacket={{ books, totalPages, resultsCount }} />
      <div style={{ flex: 1, padding: 0, minHeight: 450 }}>
        <BookResults {...{ books, uiView }} />
      </div>
    </>
  );
};

const BookResults: SFC<{ books: any; uiView: any }> = ({ books, uiView }) => {
  const isUpdating = useContext(ModuleUpdateContext);

  return (
    <>
      {!books.length ? (
        <div className="alert alert-warning" style={{ marginTop: "20px", marginRight: "5px" }}>
          No books found
        </div>
      ) : null}

      {isUpdating ? <Loading /> : null}

      {uiView.isGridView ? (
        <GridView books={books} />
      ) : uiView.isBasicList ? (
        <BasicListView books={books} />
      ) : uiView.isCoversList ? (
        <CoversView books={books} />
      ) : null}
    </>
  );
};
