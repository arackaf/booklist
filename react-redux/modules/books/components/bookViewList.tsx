import React, { Component, SFC } from "react";
const { useState } = React as any;
import { connect } from "react-redux";
import { createSelector } from "reselect";

import DBR from "./displayBookResults";
const DisplayBookResults: any = DBR;

import BMB from "./booksMenuBar";
const BooksMenuBar: any = BMB;

import BooksLoading from "./booksLoading";
import Loadable from "react-loadable";

import { selectBookList, selectBookSelection } from "../reducers/books/reducer";
import ComponentLoading from "applicationRoot/components/componentLoading";

import { MutationType } from "reactStartup";
import { mutation } from "micro-graphql-react";
import { EDITING_BOOK_SAVED } from "modules/books/reducers/books/actionNames";

import UpdateBookMutation from "graphQL/books/updateBook.graphql";

const ManualBookEntry = Loadable({
  loader: () => import(/* webpackChunkName: "manual-book-entry-modal" */ "applicationRoot/components/manualBookEntry"),
  loading: ComponentLoading,
  delay: 200
});

const BookSubjectSetter = Loadable({
  loader: () => import(/* webpackChunkName: "book-list-modals" */ "./bookSubjectSetter"),
  loading: ComponentLoading,
  delay: 200
});

const BookTagSetter = Loadable({
  loader: () => import(/* webpackChunkName: "book-list-modals" */ "./bookTagSetter"),
  loading: ComponentLoading,
  delay: 200
});

const SubjectEditModal = Loadable({
  loader: () => import(/* webpackChunkName: "book-list-modals" */ "./subjectEditModal"),
  loading: ComponentLoading,
  delay: 200
});

const TagEditModal = Loadable({
  loader: () => import(/* webpackChunkName: "book-list-modals" */ "./tagEditModal"),
  loading: ComponentLoading,
  delay: 200
});

const BookSearchModal = Loadable({
  loader: () => import(/* webpackChunkName: "book-list-modals" */ "./bookSearchModal"),
  loading: ComponentLoading,
  delay: 200
});

const mainSelector = createSelector(selectBookList, selectBookSelection, (books, bookSelection) => {
  return {
    ...books,
    ...bookSelection
  };
});
type MainSelectorType = ReturnType<typeof mainSelector>;

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

const BookViewingList: SFC<MainSelectorType & MutationType & { dispatch: any }> = props => {
  const [bookSubModifying, bookSubModalLoaded, openBookSubModal, closeBookSubModal] = useCodeSplitModal(null);
  const editSubjectsForBook = book => openBookSubModal([book]);
  const editSubjectsForSelectedBooks = () => openBookSubModal(props.booksList.filter(b => props.selectedBookHash[b._id]));

  const [bookTagModifying, bookTagModalLoaded, openBookTagModal, closeBookTagModal] = useCodeSplitModal(null);
  const editTagsForBook = book => openBookTagModal([book]);
  const editTagsForSelectedBooks = () => openBookTagModal(props.booksList.filter(b => props.selectedBookHash[b._id]));

  const [tagEditModalOpen, tagEditModalLoaded, editTags, stopEditingTags] = useCodeSplitModal();
  const [subjectEditModalOpen, subjectEditModalLoaded, editSubjects, stopEditingSubjects] = useCodeSplitModal();
  const [editingFilters, editingFiltersLoaded, beginEditFilters, endEditFilters] = useCodeSplitModal();

  const [editingBook, bookEditingModalLoaded, openBookEditModal, stopEditingBook] = useCodeSplitModal(null);
  const editBook = book => openBookEditModal(book);

  const saveEditingBook = book => {
    let bookToUse = prepBookForSaving(book);
    Promise.resolve(props.runMutation({ _id: book._id, book: bookToUse })).then(resp => {
      stopEditingBook();
      props.dispatch({ type: EDITING_BOOK_SAVED, book: resp.updateBook.Book });
    });
  };

  let dragTitle = editingBook
    ? `Click or drag to upload a ${editingBook.smallImage ? "new" : ""} cover image.  The uploaded image will be scaled down as needed`
    : "";

  return (
    <div style={{}}>
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
          {!props.booksList.length && !props.booksLoading ? (
            <div className="alert alert-warning" style={{ borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0 }}>
              No books found
            </div>
          ) : null}

          <DisplayBookResults {...{ editSubjectsForBook, editTagsForBook, editBook }} />

          {bookEditingModalLoaded ? (
            <ManualBookEntry
              title={editingBook ? `Edit ${editingBook.title}` : ""}
              dragTitle={dragTitle}
              bookToEdit={editingBook}
              isOpen={!!editingBook}
              isSaving={props.running}
              isSaved={false}
              saveBook={saveEditingBook}
              saveMessage={"Saved"}
              onClosing={stopEditingBook}
            />
          ) : null}
        </div>
      </div>
      <br />
      <br />

      {bookSubModalLoaded ? <BookSubjectSetter modifyingBooks={bookSubModifying} onDone={closeBookSubModal} /> : null}
      {bookTagModalLoaded ? <BookTagSetter modifyingBooks={bookTagModifying} onDone={closeBookTagModal} /> : null}

      {subjectEditModalLoaded ? <SubjectEditModal editModalOpen={subjectEditModalOpen} stopEditing={stopEditingSubjects} /> : null}
      {tagEditModalLoaded ? <TagEditModal editModalOpen={tagEditModalOpen} onDone={stopEditingTags} /> : null}
      {editingFiltersLoaded ? <BookSearchModal isOpen={editingFilters} onHide={endEditFilters} /> : null}
    </div>
  );
};

export default mutation(UpdateBookMutation)(connect(mainSelector)(BookViewingList));
