import React, { SFC, Suspense, lazy, useContext, useEffect } from "react";
const { useState } = React as any;
import { connect } from "react-redux";
import { createSelector } from "reselect";

import DisplayBookResults from "./displayBookResults";
import BooksMenuBar from "./booksMenuBar";
import BooksLoading from "./booksLoading";

import { selectBookList, selectBookSelection } from "../reducers/books/reducer";
import Loading from "applicationRoot/components/loading";

import { MutationType } from "reactStartup";
import { useMutation, buildMutation } from "micro-graphql-react";
import { EDITING_BOOK_SAVED } from "modules/books/reducers/books/actionNames";

import UpdateBookMutation from "graphQL/books/updateBook.graphql";
import { AppContext } from "applicationRoot/renderUI";
import { REQUEST_MOBILE, REQUEST_DESKTOP } from "applicationRoot/appState";

const ManualBookEntry: any = lazy(() => import(/* webpackChunkName: "manual-book-entry-modal" */ "applicationRoot/components/manualBookEntry"));
const BookSubjectSetter: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./bookSubjectSetter"));
const BookTagSetter: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./bookTagSetter"));
const SubjectEditModal: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./subjectEditModal"));
const TagEditModal: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./tagEditModal"));
const BookSearchModal: any = lazy(() => import(/* webpackChunkName: "book-list-modals" */ "./bookSearchModal"));

const mainSelector = createSelector(
  selectBookList,
  selectBookSelection,
  (books, bookSelection) => {
    return {
      ...books,
      ...bookSelection
    };
  }
);
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

  //now use the hook in a function component
  const [appState, dispatch, { requestDesktop, requestMobile, setModule }] = useContext(AppContext);

  console.log("appState.showingDesktop", appState.showingDesktop, "appState.module", appState.module);

  setTimeout(() => {
    appState.showingDesktop ? requestMobile() : requestDesktop();
    //setModule(appState.module === "books" ? "scan" : "books");

    if (0) {
      dispatch({});
    }
    //dispatch({ type: appState.showingDesktop ? REQUEST_MOBILE : REQUEST_DESKTOP });
  }, 1000);

  return (
    <div style={{}}>
      <BooksLoading />
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </div>
  );
};

export default connect(mainSelector)(BookViewingList);
