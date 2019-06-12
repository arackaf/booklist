import React, { SFC, Suspense, lazy, useContext, createContext, useState, useLayoutEffect, useReducer } from "react";

import BooksMenuBar from "./components/booksMenuBar";
import BooksLoading from "./components/booksLoading";

import Loading from "app/components/loading";

import { useMutation, buildMutation } from "micro-graphql-react";

import UpdateBookMutation from "graphQL/books/updateBook.graphql";
import UpdateBooksReadMutation from "graphQL/books/updateBooksRead.graphql";
import DeleteBookMutation from "graphQL/books/deleteBook.graphql";

import { useTagsState, TagsContext } from "app/tagsState";
import { BooksContext, useBooks } from "./booksState";
import { BookSearchState, useBooksSearchState, useBookSearchUiView } from "./booksSearchState";

import GridView from "./components/bookViews/gridList";
import LazyModal from "app/components/lazyModal";

const BasicListView = lazy(() => import(/* webpackChunkName: "basic-view-list" */ "./components/bookViews/basicList"));
const CoversView = lazy(() => import(/* webpackChunkName: "basic-view-list" */ "./components/bookViews/coversList"));

const CreateBookModal = LazyModal(() => import(/* webpackChunkName: "manual-book-entry-modal" */ "app/components/editBook/editModal"));
const BookSubjectSetter = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/bookSubjectSetter"));
const BookTagSetter = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/bookTagSetter"));
const SubjectEditModal = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/subjectEditModal"));
const TagEditModal = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/tagEditModal"));
const BookSearchModal = LazyModal(() => import(/* webpackChunkName: "book-list-modals" */ "./components/bookSearchModal"));

const useCodeSplitModal = (initialOpenData = false): any => {
  const [openState, setModalState] = useState(initialOpenData);
  return [openState, (val = true) => setModalState(val), () => setModalState(false)];
};

const prepBookForSaving = book => {
  let propsToUpdate = ["title", "isbn", "smallImage", "pages", "publisher", "publicationDate", "authors"];
  let pages = parseInt(book.pages, 10);
  book.pages = isNaN(pages) ? void 0 : pages;

  return propsToUpdate.reduce((obj, prop) => ((obj[prop] = book[prop]), obj), {});
};

export const BooksSearchContext = createContext<[BookSearchState, any, any]>(null);

export default () => {
  let booksSearchState = useBooksSearchState();
  let tagsState = useTagsState();

  return (
    <div style={{}}>
      <Suspense fallback={<Loading />}>
        <BooksSearchContext.Provider value={booksSearchState}>
          <TagsContext.Provider value={tagsState}>
            <BooksContexHolder />
          </TagsContext.Provider>
        </BooksSearchContext.Provider>
      </Suspense>
    </div>
  );
};

const BooksContexHolder = () => {
  let booksState = useBooks();

  return (
    <BooksContext.Provider value={booksState}>
      <BookViewingList />
    </BooksContext.Provider>
  );
};

const initialBooksState = { selectedBooks: {}, savingReadForBooks: {}, pendingDelete: {}, deleting: {} };

const keysToHash = (_ids, value) => (Array.isArray(_ids) ? _ids : [_ids]).reduce((o, _id) => ((o[_id] = value), o), {});

function booksUiStateReducer(state, [action, payload = null]) {
  switch (action) {
    case "select":
      return { ...state, selectedBooks: { ...state.selectedBooks, ...keysToHash(payload, true) } };
    case "de-select":
      return { ...state, selectedBooks: { ...state.selectedBooks, ...keysToHash(payload, false) } };
    case "toggle-select":
      return { ...state, selectedBooks: { ...state.selectedBooks, [payload]: !state.selectedBooks[payload] } };
    case "read-saving":
      return { ...state, savingReadForBooks: { ...state.savingReadForBooks, ...keysToHash(payload, true) } };
    case "read-saved":
      return { ...state, savingReadForBooks: { ...state.savingReadForBooks, ...keysToHash(payload, false) } };
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

const BookViewingList: SFC<{}> = props => {
  const { books, booksLoading, booksLoaded, currentQuery } = useContext(BooksContext);

  const [booksUiState, dispatchBooksUiState] = useReducer(booksUiStateReducer, initialBooksState);
  useLayoutEffect(() => dispatchBooksUiState(["reset"]), [currentQuery]);

  const [bookSubModifying, openBookSubModal, closeBookSubModal] = useCodeSplitModal(null);
  const editSubjectsForBook = book => openBookSubModal([book]);
  const editSubjectsForSelectedBooks = () => openBookSubModal(books.filter(b => booksUiState.selectedBooks[b._id]));

  const [bookTagModifying, openBookTagModal, closeBookTagModal] = useCodeSplitModal(null);
  const editTagsForBook = book => openBookTagModal([book]);
  const editTagsForSelectedBooks = () => openBookTagModal(books.filter(b => booksUiState.selectedBooks[b._id]));

  const [tagEditModalOpen, editTags, stopEditingTags] = useCodeSplitModal();
  const [subjectEditModalOpen, editSubjects, stopEditingSubjects] = useCodeSplitModal();
  const [editingFilters, beginEditFilters, endEditFilters] = useCodeSplitModal();

  const [editingBook, openBookEditModal, stopEditingBook] = useCodeSplitModal(null);
  const editBook = book => openBookEditModal(book);

  const { runMutation, running } = useMutation(buildMutation(UpdateBookMutation));
  const { runMutation: setReadStatus } = useMutation(buildMutation(UpdateBooksReadMutation));
  const { runMutation: deleteBook } = useMutation(buildMutation(DeleteBookMutation));

  const saveEditingBook = book => {
    let bookToUse = prepBookForSaving(book);
    Promise.resolve(runMutation({ _id: book._id, book: bookToUse })).then(resp => {
      stopEditingBook();
    });
  };

  const setRead = (_ids, isRead) => {
    dispatchBooksUiState(["read-saving", _ids]);
    Promise.resolve(setReadStatus({ _ids, isRead })).then(() => {
      dispatchBooksUiState(["read-saved", _ids]);
    });
  };

  const runDelete = _id => {
    dispatchBooksUiState(["delete", _id]);
    deleteBook({ _id });
  };

  const uiView = useBookSearchUiView();

  return (
    <>
      <BooksLoading />
      <div className="standard-module-container">
        <BooksMenuBar
          startTagModification={editTagsForSelectedBooks}
          startSubjectModification={editSubjectsForSelectedBooks}
          editTags={editTags}
          editSubjects={editSubjects}
          beginEditFilters={beginEditFilters}
          {...{ booksUiState, setRead }}
        />
        <div style={{ flex: 1, padding: 0, minHeight: 450 }}>
          {!books.length && !booksLoading && booksLoaded ? (
            <div className="alert alert-warning" style={{ marginTop: "20px", marginRight: "5px" }}>
              No books found
            </div>
          ) : null}

          {uiView.isGridView ? (
            <GridView
              {...{ editBook, setRead, booksUiState, dispatchBooksUiState, runDelete }}
              editBooksTags={editTagsForBook}
              editBooksSubjects={editSubjectsForBook}
            />
          ) : uiView.isBasicList ? (
            <Suspense fallback={<Loading />}>
              <BasicListView {...{ booksUiState, dispatchBooksUiState, editBook, runDelete }} />
            </Suspense>
          ) : uiView.isCoversList ? (
            <Suspense fallback={<Loading />}>
              <CoversView {...{ saveEditingBook }} />
            </Suspense>
          ) : null}
        </div>
      </div>
      <br />
      <br />

      <Suspense fallback={<Loading />}>
        <CreateBookModal
          title={editingBook ? `Edit ${editingBook.title}` : ""}
          bookToEdit={editingBook}
          isOpen={!!editingBook}
          saveBook={saveEditingBook}
          saveMessage={"Saved"}
          onClosing={stopEditingBook}
        />

        <BookSubjectSetter isOpen={bookSubModifying} modifyingBooks={bookSubModifying} onDone={closeBookSubModal} />
        <BookTagSetter isOpen={bookTagModifying} modifyingBooks={bookTagModifying} onDone={closeBookTagModal} />

        <SubjectEditModal isOpen={subjectEditModalOpen} editModalOpen={subjectEditModalOpen} stopEditing={stopEditingSubjects} />
        <TagEditModal isOpen={tagEditModalOpen} editModalOpen={tagEditModalOpen} onDone={stopEditingTags} />
        <BookSearchModal isOpen={editingFilters} onHide={endEditFilters} />
      </Suspense>
    </>
  );
};
