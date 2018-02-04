import { BooksModuleType, AppType, bookSearchType, TagsType } from "modules/books/reducers/reducer";

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

import { graphqlClient, MutationType } from "reactStartup";
import { mutation } from "micro-graphql-react";
import { EDITING_BOOK_SAVED } from "modules/books/reducers/books/actionNames";

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

type mainSelectorType = BookListType & BookSelectionType & { editingBookSearchFilters: boolean };

const mainSelector = createSelector<BooksModuleType, mainSelectorType, bookSearchType, BookListType, BookSelectionType>(
  state => state.booksModule.bookSearch,
  selectBookList,
  selectBookSelection,
  (bookSearch, books, bookSelection) => {
    return {
      editingBookSearchFilters: bookSearch.editingFilters,
      ...books,
      ...bookSelection
    };
  }
);

@mutation(
  graphqlClient,
  `mutation updateBook($_id: String, $book: BookMutationInput) {
    updateBook(
      _id: $_id,
      Updates: $book
    ) {
      Book {
        _id,
        title,
        isbn,
        smallImage,
        pages,
        publisher,
        publicationDate,
        authors
      }
    }
  }`
)
@connect(mainSelector)
export default class BookViewingList extends Component<mainSelectorType & MutationType & { dispatch: any }, any> {
  state = {
    navBarHeight: null,
    tagEditModalOpen: false,
    subjectEditModalOpen: false,
    booksSubjectModifying: null,
    booksTagModifying: null,
    isEditingBook: false,
    editingBook: null
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

    let { editBook, editTagsForBook, editSubjectsForBook } = this;

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
          />
          <div className="panel-body" style={{ padding: 0, minHeight: 450, position: "relative" }}>
            {!this.props.booksList.length && !this.props.booksLoading ? (
              <div className="alert alert-warning" style={{ borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0 }}>
                No books found
              </div>
            ) : null}

            <DisplayBookResults {...{ editBook, editTagsForBook, editSubjectsForBook }} navBarHeight={this.state.navBarHeight} />

            {this.state.isEditingBook ? (
              <ManualBookEntry
                title={editingBook ? `Edit ${editingBook.title}` : ""}
                dragTitle={dragTitle}
                bookToEdit={editingBook}
                isOpen={this.state.isEditingBook}
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

        {this.state.booksSubjectModifying ? (
          <BookSubjectSetter modifyingBooks={this.state.booksSubjectModifying} onDone={this.doneEditingBooksSubjects} />
        ) : null}
        {this.state.booksTagModifying ? <BookTagSetter modifyingBooks={this.state.booksTagModifying} onDone={this.doneEditingBooksTags} /> : null}

        {this.state.subjectEditModalOpen ? (
          <SubjectEditModal editModalOpen={this.state.subjectEditModalOpen} stopEditing={this.stopEditingSubjects} />
        ) : null}
        {this.state.tagEditModalOpen ? <TagEditModal editModalOpen={this.state.tagEditModalOpen} onDone={this.stopEditingTags} /> : null}
        {this.props.editingBookSearchFilters ? <BookSearchModal /> : null}
      </div>
    );
  }
}
