import React, { Component } from "react";
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
  loader: () => System.import(/* webpackChunkName: "manual-book-entry-modal" */ "applicationRoot/components/manualBookEntry"),
  loading: ComponentLoading,
  delay: 200
});

const BookSubjectSetter = Loadable({
  loader: () => System.import(/* webpackChunkName: "book-list-modals" */ "./bookSubjectSetter"),
  loading: ComponentLoading,
  delay: 200
});

const BookTagSetter = Loadable({
  loader: () => System.import(/* webpackChunkName: "book-list-modals" */ "./bookTagSetter"),
  loading: ComponentLoading,
  delay: 200
});

const SubjectEditModal = Loadable({
  loader: () => System.import(/* webpackChunkName: "book-list-modals" */ "./subjectEditModal"),
  loading: ComponentLoading,
  delay: 200
});

const TagEditModal = Loadable({
  loader: () => System.import(/* webpackChunkName: "book-list-modals" */ "./tagEditModal"),
  loading: ComponentLoading,
  delay: 200
});

const BookSearchModal = Loadable({
  loader: () => System.import(/* webpackChunkName: "book-list-modals" */ "./bookSearchModal"),
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

@mutation(UpdateBookMutation)
@connect(mainSelector)
export default class BookViewingList extends Component<MainSelectorType & MutationType & { dispatch: any }, any> {
  state = {
    tagEditModalOpen: false,
    tagEditModalLoaded: false,
    subjectEditModalOpen: false,
    subjectEditModalLoaded: false,
    booksSubjectModifying: null,
    booksSubjectModalLoaded: null,
    booksTagModifying: null,
    booksTagModalLoaded: null,
    isEditingBook: false,
    editingBook: null,
    editingFilters: false,
    editingFiltersLoaded: false,
    beginEditFilters: () => this.setState({ editingFilters: true, editingFiltersLoaded: true }),
    endEditFilters: () => this.setState({ editingFilters: false })
  };
  editTags = () => this.setState({ tagEditModalOpen: true, tagEditModalLoaded: true });
  stopEditingTags = () => this.setState({ tagEditModalOpen: false });
  editSubjects = () => this.setState({ subjectEditModalOpen: true, subjectEditModalLoaded: true });
  stopEditingSubjects = () => this.setState({ subjectEditModalOpen: false });

  editSubjectsForBook = book => this.setState({ booksSubjectModifying: [book], booksSubjectModalLoaded: true });
  editSubjectsForSelectedBooks = () =>
    this.setState({ booksSubjectModifying: this.props.booksList.filter(b => this.props.selectedBookHash[b._id]), booksSubjectModalLoaded: true });
  doneEditingBooksSubjects = () => this.setState({ booksSubjectModifying: null });

  editTagsForBook = book => this.setState({ booksTagModifying: [book], booksTagModalLoaded: true });
  editTagsForSelectedBooks = () =>
    this.setState({ booksTagModifying: this.props.booksList.filter(b => this.props.selectedBookHash[b._id]), booksTagModalLoaded: true });
  doneEditingBooksTags = () => this.setState({ booksTagModifying: null });

  editBook = book =>
    this.setState({
      isEditingBook: true,
      editingBook: book
    });
  stopEditingBook = () => this.setState({ isEditingBook: false });
  saveEditingBook = book => {
    let propsToUpdate = ["title", "isbn", "smallImage", "pages", "publisher", "publicationDate", "authors"];
    let pages = parseInt(book.pages, 10);
    book.pages = isNaN(pages) ? void 0 : pages;

    let bookToUse = propsToUpdate.reduce((obj, prop) => ((obj[prop] = book[prop]), obj), {});
    Promise.resolve(this.props.runMutation({ _id: book._id, book: bookToUse })).then(resp => {
      this.setState({
        isEditingBook: false,
        editingBook: null
      });
      this.props.dispatch({ type: EDITING_BOOK_SAVED, book: resp.updateBook.Book });
    });
  };

  render() {
    let editingBook = this.state.editingBook,
      dragTitle = editingBook
        ? `Click or drag to upload a ${editingBook.smallImage ? "new" : ""} cover image.  The uploaded image will be scaled down as needed`
        : "";

    let { state, editBook, editTagsForBook, editSubjectsForBook } = this;
    let { isEditingBook, editingFilters, beginEditFilters, endEditFilters } = state;
    let { subjectEditModalOpen, booksSubjectModifying, booksTagModifying, tagEditModalOpen } = state;

    return (
      <div style={{}}>
        <BooksLoading />
        <div style={{ marginLeft: "5px", marginTop: 0 }}>
          <BooksMenuBar
            startTagModification={this.editTagsForSelectedBooks}
            startSubjectModification={this.editSubjectsForSelectedBooks}
            editTags={this.editTags}
            editSubjects={this.editSubjects}
            beginEditFilters={beginEditFilters}
          />
          <div style={{ flex: 1, padding: 0, minHeight: 450 }}>
            {!this.props.booksList.length && !this.props.booksLoading ? (
              <div className="alert alert-warning" style={{ borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0 }}>
                No books found
              </div>
            ) : null}

            <DisplayBookResults {...{ editBook, editTagsForBook, editSubjectsForBook }} />

            {isEditingBook ? (
              <ManualBookEntry
                title={editingBook ? `Edit ${editingBook.title}` : ""}
                dragTitle={dragTitle}
                bookToEdit={editingBook}
                isOpen={isEditingBook}
                isSaving={this.props.running}
                isSaved={false}
                saveBook={this.saveEditingBook}
                saveMessage={"Saved"}
                onClosing={this.stopEditingBook}
              />
            ) : null}
          </div>
        </div>
        <br />
        <br />

        {this.state.booksSubjectModalLoaded ? (
          <BookSubjectSetter modifyingBooks={booksSubjectModifying} onDone={this.doneEditingBooksSubjects} />
        ) : null}
        {this.state.booksTagModalLoaded ? <BookTagSetter modifyingBooks={booksTagModifying} onDone={this.doneEditingBooksTags} /> : null}

        {this.state.subjectEditModalLoaded ? <SubjectEditModal editModalOpen={subjectEditModalOpen} stopEditing={this.stopEditingSubjects} /> : null}
        {this.state.tagEditModalLoaded ? <TagEditModal editModalOpen={tagEditModalOpen} onDone={this.stopEditingTags} /> : null}
        {this.state.editingFiltersLoaded ? <BookSearchModal isOpen={editingFilters} onHide={endEditFilters} /> : null}
      </div>
    );
  }
}
