import React, { Suspense, useEffect, useReducer, useContext, useState, FunctionComponent } from "react";

import BooksMenuBar, { BooksMenuBarDisabled } from "./components/menuBar/menuBar";
import Loading from "app/components/loading";

import GridView from "./components/bookViews/gridList";

import BasicListView from "./components/bookViews/basicList";
import CoversView from "./components/bookViews/coversList";

import { useBooks } from "./booksState";
import { useMutation } from "micro-graphql-react";
import { useCodeSplitModal } from "./util";

import UpdateBookMutation from "graphQL/books/updateBook.graphql";
import UpdateBooksReadMutation from "graphQL/books/updateBooksRead.graphql";
import DeleteBookMutation from "graphQL/books/deleteBook.graphql";
import { MutationOf, Mutations } from "graphQL/graphql-typings";
import { useBookSearchUiView, BookSearchUiView } from "./booksUiState";
import { ModuleUpdateContext } from "app/state/appState";
import { useHeight } from "app/animationHelpers";
import { useTransition, animated } from "react-spring";

import CreateBookModal from "app/components/editBook/editModal";
import BookSubjectSetter from "./components/bookSubjectSetter";
import BookTagSetter from "./components/bookTagSetter";
import SubjectEditModal from "./components/subjectEditModal";
import TagEditModal from "./components/tagEditModal";
import BookSearchModal from "./components/bookSearchModal";

import { BooksModuleContext, initialBooksState } from "./booksState";

const prepBookForSaving = book => {
  let propsToUpdate = ["title", "isbn", "smallImage", "pages", "publisher", "publicationDate", "authors", "subjects", "tags"];
  let pages = parseInt(book.pages, 10);
  book.pages = isNaN(pages) ? void 0 : pages;

  return propsToUpdate.reduce((obj, prop) => ((obj[prop] = book[prop]), obj), {});
};

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
    <section className="book-display-module full flush-bottom">
      <BooksModuleContext.Provider value={{ actions, booksUiState, dispatchBooksUiState }}>
        <RenderModule />

        <Suspense fallback={<Loading />}>
          <SubjectEditModal editModalOpen={subjectEditModalOpen} stopEditing={stopEditingSubjects} />
          <TagEditModal editModalOpen={tagEditModalOpen} onDone={stopEditingTags} />
          <BookSearchModal isOpen={editingFilters} onHide={endEditFilters} />

          <BookSubjectSetter modifyingBooks={bookSubModifying || []} onDone={closeBookSubModal} />
          <BookTagSetter modifyingBooks={bookTagModifying || []} onDone={closeBookTagModal} />

          <CreateBookModal
            title={editingBook ? `Edit: ${editingBook.title}` : ""}
            bookToEdit={editingBook}
            isOpen={!!editingBook}
            saveBook={saveEditingBook}
            saveMessage={"Saved"}
            onClosing={stopEditingBook}
          />
        </Suspense>
      </BooksModuleContext.Provider>
    </section>
  );
};

const Fallback: FunctionComponent<{ uiView: BookSearchUiView; totalPages: number; resultsCount: number }> = ({
  uiView,
  totalPages,
  resultsCount
}) => {
  const [measureRef, menuBarHeight] = useHeight();

  return (
    <>
      <BooksMenuBarDisabled measureRef={measureRef} totalPages={totalPages} resultsCount={resultsCount} />

      <h1 style={{ color: "var(--neutral-5)", fontSize: "2em", marginTop: "5px" }}>
        Books are loading <i className="fas fa-cog fa-spin"></i>
      </h1>
    </>
  );
};

const RenderModule: FunctionComponent<{}> = ({}) => {
  const uiView = useBookSearchUiView();
  const [lastBookResults, setLastBookResults] = useState({ totalPages: 0, resultsCount: 0 });

  return (
    <div style={{ backgroundColor: "white" }}>
      <Suspense fallback={<Fallback uiView={uiView} {...lastBookResults} />}>
        <MainContent uiView={uiView} setLastBookResults={setLastBookResults} />
      </Suspense>
    </div>
  );
};

const MainContent: FunctionComponent<{ uiView: BookSearchUiView; setLastBookResults: any }> = ({ uiView, setLastBookResults }) => {
  const { books, totalPages, resultsCount, currentQuery, reload, booksLoaded } = useBooks();
  const { dispatchBooksUiState } = useContext(BooksModuleContext);

  // TODO: useEffect pending https://github.com/facebook/react/issues/17911#issuecomment-581969701
  //useLayoutEffect(() => dispatchBooksUiState(["reset"]), [currentQuery]);
  useEffect(() => dispatchBooksUiState(["reset"]), [currentQuery]);

  useEffect(() => {
    setLastBookResults({ resultsCount, totalPages });
  }, [resultsCount, totalPages]);

  const { dispatch: uiDispatch } = uiView;
  const [measureRef, menuBarHeight] = useHeight();

  const { startTransition } = useContext(ModuleUpdateContext);

  const deferredUiDispatch = arg => {
    startTransition(() => {
      uiDispatch(arg);
    });
  };

  return (
    <>
      <BooksMenuBar
        measureRef={measureRef}
        uiDispatch={deferredUiDispatch}
        uiView={uiView}
        bookResultsPacket={{ books, totalPages, resultsCount, reload, booksLoaded }}
      />

      <BookResults menuBarHeight={menuBarHeight} {...{ books, currentQuery, uiView }} />
    </>
  );
};

const BookResults: FunctionComponent<{ books: any; currentQuery: string; uiView: any; menuBarHeight: any }> = ({
  books,
  currentQuery,
  uiView,
  menuBarHeight
}) => {
  const { isPending } = useContext(ModuleUpdateContext);

  const resultsTransition = useTransition(
    { currentQuery, books },
    {
      keys: ({ currentQuery }) => currentQuery,
      config: { duration: 150 },
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 }
    }
  );

  return (
    <div className="overlay-holder">
      {resultsTransition((styles: any, { books }) => (
        <animated.div style={{ padding: 0, minHeight: 450, ...styles }}>
          {!books.length ? (
            <div className="alert alert-warning" style={{ marginTop: "20px" }}>
              No books found
            </div>
          ) : null}

          {isPending ? <Loading /> : null}

          {uiView.isGridView ? (
            <GridView menuBarHeight={menuBarHeight} books={books} />
          ) : uiView.isBasicList ? (
            <BasicListView books={books} />
          ) : uiView.isCoversList ? (
            <CoversView books={books} />
          ) : null}
        </animated.div>
      ))}
    </div>
  );
};
