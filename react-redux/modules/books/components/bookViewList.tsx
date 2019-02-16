import React, { SFC, Suspense, lazy, useContext, useEffect, createContext } from "react";
const { useState } = React as any;

import DisplayBookResults from "./displayBookResults";
import BooksMenuBar from "./booksMenuBar";
import BooksLoading from "./booksLoading";

import Loading from "applicationRoot/components/loading";

import { MutationType } from "reactStartup";
import { useMutation, buildMutation } from "micro-graphql-react";
import { EDITING_BOOK_SAVED } from "modules/books/reducers/books/actionNames";

import UpdateBookMutation from "graphQL/books/updateBook.graphql";
import { AppContext } from "applicationRoot/renderUI";
import { TagsState, useTagsState } from "applicationRoot/tagsState";
import { useBooksState, BooksState, useBookList } from "../booksState";
import { BookSearchState, useBooksSearchState } from "../booksSearchState";

const ManualBookEntry: any = lazy(() => import(/* webpackChunkName: "manual-book-entry-modal" */ "applicationRoot/components/manualBookEntry"));
const BookSubjectSetter: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./bookSubjectSetter"));
const BookTagSetter: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./bookTagSetter"));
const SubjectEditModal: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./subjectEditModal"));
const TagEditModal: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./tagEditModal"));
const BookSearchModal: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./bookSearchModal"));

const useCodeSplitModal = (initialOpenData = false) => {
  const [[openState, isLoaded], setModalState] = useState([initialOpenData, false]);
  return [openState, isLoaded, (val = true) => setModalState([val, true]), () => setModalState([false, true])];
};

const prepBookForSaving = book => {
  let propsToUpdate = ["title", "isbn", "smallImage", "pages", "publisher", "publicationDate", "authors"];
  let pages = parseInt(book.pages, 10);
  book.pages = isNaN(pages) ? void 0 : pages;

  return propsToUpdate.reduce((obj, prop) => ((obj[prop] = book[prop]), obj), {});
};

export const BooksContext = createContext<[BooksState, any, any]>(null);
export const BooksSearchContext = createContext<[BookSearchState, any, any]>(null);
export const TagsContext = createContext<[TagsState, any, any]>(null);

export const BookModuleRoot = () => {
  let booksState = useBooksState();
  let booksSearchState = useBooksSearchState();
  let tagsState = useTagsState();

  return (
    <div style={{}}>
      <Suspense fallback={<Loading />}>
        <BooksContext.Provider value={booksState}>
          <BooksSearchContext.Provider value={booksSearchState}>
            <TagsContext.Provider value={tagsState}>
              <BookViewingList />
            </TagsContext.Provider>
          </BooksSearchContext.Provider>
        </BooksContext.Provider>
      </Suspense>
    </div>
  );
};

const BookViewingList: SFC<Partial<MutationType> & { dispatch?: any }> = props => {
  let tagsPacket = useTagsState();
  let [tagsState, { loadTags }, dispatch] = tagsPacket;
  let [appState] = useContext(AppContext);

  let booksPacket = useContext(BooksContext);
  let [booksState, actions] = booksPacket;

  useEffect(() => {
    actions.loadBooks(appState);
  }, []);

  useEffect(() => {
    loadTags(appState);
  }, []);

  const { booksList, booksLoading } = useBookList();
  const [bookSubModifying, bookSubModalLoaded, openBookSubModal, closeBookSubModal] = useCodeSplitModal(null);
  const editSubjectsForBook = book => openBookSubModal([book]);
  const editSubjectsForSelectedBooks = () => openBookSubModal(booksList.filter(b => booksState.selectedBooks[b._id]));

  const [bookTagModifying, bookTagModalLoaded, openBookTagModal, closeBookTagModal] = useCodeSplitModal(null);
  const editTagsForBook = book => openBookTagModal([book]);
  const editTagsForSelectedBooks = () => openBookTagModal(booksList.filter(b => booksState.selectedBooks[b._id]));

  const [tagEditModalOpen, tagEditModalLoaded, editTags, stopEditingTags] = useCodeSplitModal();
  const [subjectEditModalOpen, subjectEditModalLoaded, editSubjects, stopEditingSubjects] = useCodeSplitModal();
  const [editingFilters, editingFiltersLoaded, beginEditFilters, endEditFilters] = useCodeSplitModal();

  const [editingBook, bookEditingModalLoaded, openBookEditModal, stopEditingBook] = useCodeSplitModal(null);
  const editBook = book => openBookEditModal(book);

  const { runMutation, running } = useMutation(buildMutation(UpdateBookMutation));

  const saveEditingBook = book => {
    let bookToUse = prepBookForSaving(book);
    Promise.resolve(runMutation({ _id: book._id, book: bookToUse })).then(resp => {
      stopEditingBook();
      props.dispatch({ type: EDITING_BOOK_SAVED, book: resp.updateBook.Book });
    });
  };

  let dragTitle = editingBook
    ? `Click or drag to upload a ${editingBook.smallImage ? "new" : ""} cover image.  The uploaded image will be scaled down as needed`
    : "";

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
        />
        <div style={{ flex: 1, padding: 0, minHeight: 450 }}>
          {!booksList.length && !booksLoading ? (
            <div className="alert alert-warning" style={{ borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0 }}>
              No books found
            </div>
          ) : null}

          <DisplayBookResults {...{ editSubjectsForBook, editTagsForBook, editBook }} />
        </div>
      </div>
      <br />
      <br />

      <Suspense fallback={<Loading />}>
        {bookEditingModalLoaded ? (
          <ManualBookEntry
            title={editingBook ? `Edit ${editingBook.title}` : ""}
            dragTitle={dragTitle}
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
