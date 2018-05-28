import { BooksModuleType, AppType, BookSearchType, TagsType } from "modules/books/reducers/reducer";

import React, { Component } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import DBR from "./displayBookResults";
const DisplayBookResults: any = DBR;

import BMB from "./booksMenuBar";
const BooksMenuBar: any = BMB;

import BooksLoading from "./booksLoading";
import Loadable from "react-loadable";

import { BookListType, selectBookList, selectBookSelection, BookSelectionType } from "../reducers/books/reducer";
import ComponentLoading from "applicationRoot/components/componentLoading";

import { MutationType } from "reactStartup";
import { mutation } from "micro-graphql-react";
import { EDITING_BOOK_SAVED } from "modules/books/reducers/books/actionNames";

import UpdateBookMutation from "./updateBook.graphql";

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

type MainSelectorType = BookListType & BookSelectionType;

const mainSelector = createSelector<BooksModuleType, MainSelectorType, BookListType, BookSelectionType>(
  selectBookList,
  selectBookSelection,
  (books, bookSelection) => {
    return {
      ...books,
      ...bookSelection
    };
  }
);

@mutation(UpdateBookMutation)
@connect(mainSelector)
export default class BookViewingList extends Component<MainSelectorType & MutationType & { dispatch: any }, any> {
  state = {
    navBarHeight: null,
    tagEditModalOpen: false,
    subjectEditModalOpen: false,
    booksSubjectModifying: null,
    booksTagModifying: null,
    isEditingBook: false,
    editingBook: null,
    editingFilters: false,
    beginEditFilters: () => this.setState({ editingFilters: true }),
    endEditFilters: () => this.setState({ editingFilters: false })
  };
  editTags = () => this.setState({ tagEditModalOpen: true });
  stopEditingTags = () => this.setState({ tagEditModalOpen: false });
  editSubjects = () => this.setState({ subjectEditModalOpen: true });
  stopEditingSubjects = () => this.setState({ subjectEditModalOpen: false });

  editSubjectsForBook = book => this.setState({ booksSubjectModifying: [book] });
  editSubjectsForSelectedBooks = () => this.setState({ booksSubjectModifying: this.props.booksList.filter(b => this.props.selectedBookHash[b._id]) });
  doneEditingBooksSubjects = () => this.setState({ booksSubjectModifying: null });

  editTagsForBook = book => this.setState({ booksTagModifying: [book] });
  editTagsForSelectedBooks = () => this.setState({ booksTagModifying: this.props.booksList.filter(b => this.props.selectedBookHash[b._id]) });
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

  navBarSized = contentRect => {
    this.setState({ navBarHeight: contentRect.client.height });
  };
  render() {
    let editingBook = this.state.editingBook,
      dragTitle = editingBook
        ? `Click or drag to upload a ${editingBook.smallImage ? "new" : ""} cover image.  The uploaded image will be scaled down as needed`
        : "";

    let { state, editBook, editTagsForBook, editSubjectsForBook } = this;
    let { isEditingBook, navBarHeight, editingFilters, beginEditFilters, endEditFilters } = state;
    let { subjectEditModalOpen, booksSubjectModifying, booksTagModifying, tagEditModalOpen } = state;

    return (
      <div style={{ position: "relative" }}>
        <BooksLoading />
        <div className="panel panel-default" style={{ margin: "10px" }}>
          <BooksMenuBar
            startTagModification={this.editTagsForSelectedBooks}
            startSubjectModification={this.editSubjectsForSelectedBooks}
            editTags={this.editTags}
            editSubjects={this.editSubjects}
            navBarSized={this.navBarSized}
            beginEditFilters={beginEditFilters}
          />
          <div className="panel-body" style={{ padding: 0, minHeight: 450, position: "relative" }}>
            {!this.props.booksList.length && !this.props.booksLoading ? (
              <div className="alert alert-warning" style={{ borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0 }}>
                No books found
              </div>
            ) : null}

            <DisplayBookResults {...{ editBook, editTagsForBook, editSubjectsForBook }} navBarHeight={navBarHeight} />

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

        {booksSubjectModifying ? <BookSubjectSetter modifyingBooks={booksSubjectModifying} onDone={this.doneEditingBooksSubjects} /> : null}
        {booksTagModifying ? <BookTagSetter modifyingBooks={booksTagModifying} onDone={this.doneEditingBooksTags} /> : null}

        {subjectEditModalOpen ? <SubjectEditModal editModalOpen={subjectEditModalOpen} stopEditing={this.stopEditingSubjects} /> : null}
        {tagEditModalOpen ? <TagEditModal editModalOpen={tagEditModalOpen} onDone={this.stopEditingTags} /> : null}
        {editingFilters ? <BookSearchModal isOpen={editingFilters} onHide={endEditFilters} /> : null}
      </div>
    );
  }
}
