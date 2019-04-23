import React, { SFC, Suspense, lazy, useContext, createContext, useState, useLayoutEffect, useReducer } from "react";

import BooksMenuBar from "./booksMenuBar";
import BooksLoading from "./booksLoading";

import Loading from "app/components/loading";

import { useMutation, buildMutation } from "micro-graphql-react";

import UpdateBookMutation from "graphQL/books/updateBook.graphql";
import UpdateBooksReadMutation from "graphQL/books/updateBooksRead.graphql";
import DeleteBookMutation from "graphQL/books/deleteBook.graphql";

import { AppContext } from "app/renderUI";
import { useTagsState, TagsContext } from "app/tagsState";
import { BooksContext, useBooks } from "../booksState";
import { BookSearchState, useBooksSearchState, useBookSearchUiView } from "../booksSearchState";

import GridView from "./bookViews/gridList";
const BasicListView: any = lazy(() => import(/* webpackChunkName: "basic-view-list" */ "./bookViews/basicList"));
const CoversView: any = lazy(() => import(/* webpackChunkName: "basic-view-list" */ "./bookViews/coversList"));

const ManualBookEntry: any = lazy(() => import(/* webpackChunkName: "manual-book-entry-modal" */ "app/components/manualBookEntry"));
const BookSubjectSetter: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./bookSubjectSetter"));
const BookTagSetter: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./bookTagSetter"));
const SubjectEditModal: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./subjectEditModal"));
const TagEditModal: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./tagEditModal"));
const BookSearchModal: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./bookSearchModal"));

const useCodeSplitModal = (initialOpenData = false): any => {
  const [[openState, isLoaded], setModalState] = useState([initialOpenData, false]);
  return [openState, isLoaded, (val = true) => setModalState([val, true]), () => setModalState([false, true])];
};

const prepBookForSaving = book => {
  let propsToUpdate = ["title", "isbn", "smallImage", "pages", "publisher", "publicationDate", "authors"];
  let pages = parseInt(book.pages, 10);
  book.pages = isNaN(pages) ? void 0 : pages;

  return propsToUpdate.reduce((obj, prop) => ((obj[prop] = book[prop]), obj), {});
};

export const BooksSearchContext = createContext<[BookSearchState, any, any]>(null);

export const BookModuleRoot = () => {
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
  let { tags } = useContext(TagsContext);
  let [appState] = useContext(AppContext);
  const { books, booksLoading, booksLoaded, currentQuery } = useContext(BooksContext);

  const [booksUiState, dispatchBooksUiState] = useReducer(booksUiStateReducer, initialBooksState);
  useLayoutEffect(() => dispatchBooksUiState(["reset"]), [currentQuery]);

  const [bookSubModifying, bookSubModalLoaded, openBookSubModal, closeBookSubModal] = useCodeSplitModal(null);
  const editSubjectsForBook = book => openBookSubModal([book]);
  const editSubjectsForSelectedBooks = () => openBookSubModal(books.filter(b => booksUiState.selectedBooks[b._id]));

  const [bookTagModifying, bookTagModalLoaded, openBookTagModal, closeBookTagModal] = useCodeSplitModal(null);
  const editTagsForBook = book => openBookTagModal([book]);
  const editTagsForSelectedBooks = () => openBookTagModal(books.filter(b => booksUiState.selectedBooks[b._id]));

  const [tagEditModalOpen, tagEditModalLoaded, editTags, stopEditingTags] = useCodeSplitModal();
  const [subjectEditModalOpen, subjectEditModalLoaded, editSubjects, stopEditingSubjects] = useCodeSplitModal();
  const [editingFilters, editingFiltersLoaded, beginEditFilters, endEditFilters] = useCodeSplitModal();

  const [editingBook, bookEditingModalLoaded, openBookEditModal, stopEditingBook] = useCodeSplitModal(null);
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
      <div style={{ marginLeft: "5px", marginTop: 0 }}>
        <BooksMenuBar
          startTagModification={editTagsForSelectedBooks}
          startSubjectModification={editSubjectsForSelectedBooks}
          editTags={editTags}
          editSubjects={editSubjects}
          beginEditFilters={beginEditFilters}
          {...{ booksUiState, setRead }}
        />
        <div style={{ flex: 1, padding: 0, minHeight: 450 }}>
          {!books.length && !booksLoading && !booksLoaded ? (
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
              <CoversView {...{ saveEditingBook, running }} />
            </Suspense>
          ) : null}
        </div>
      </div>
      <br />
      <br />

      <Suspense fallback={<Loading />}>
        {bookEditingModalLoaded ? (
          <ManualBookEntry
            title={editingBook ? `Edit ${editingBook.title}` : ""}
            bookToEdit={editingBook}
            isOpen={!!editingBook}
            isSaving={running}
            isSaved={false}
            saveBook={saveEditingBook}
            saveMessage={"Saved"}
            onClosing={stopEditingBook}
          />
        ) : null}
        {bookSubModalLoaded ? <BookSubjectSetter modifyingBooks={bookSubModifying} onDone={closeBookSubModal} /> : null}
        {bookTagModalLoaded ? <BookTagSetter modifyingBooks={bookTagModifying} onDone={closeBookTagModal} /> : null}

        {subjectEditModalLoaded ? <SubjectEditModal editModalOpen={subjectEditModalOpen} stopEditing={stopEditingSubjects} /> : null}
        {tagEditModalLoaded ? <TagEditModal editModalOpen={tagEditModalOpen} onDone={stopEditingTags} /> : null}
        {editingFiltersLoaded ? <BookSearchModal isOpen={editingFilters} onHide={endEditFilters} /> : null}
      </Suspense>
    </>
  );
};
