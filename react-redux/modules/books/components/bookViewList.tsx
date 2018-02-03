import { BooksModuleType, AppType, bookSearchType, TagsType } from "modules/books/reducers/reducer";

import React, { Component } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import GV from "./bookViewList-grid";
const GridView: any = GV;

import BLV from "./bookViewList-basicList";
const BasicListView: any = BLV;

import BMB from "./booksMenuBar";
const BooksMenuBar: any = BMB;

import * as actionCreatorsBooks from "../reducers/books/actionCreators";
import * as actionCreatorsSearch from "../reducers/bookSearch/actionCreators";
import Loading from "applicationRoot/components/loading";
import Loadable from "react-loadable";

import { BookListType, selectBookList, selectBookSelection, BookSelectionType } from "../reducers/books/reducer";
import { selectBookSearchUiView, bookSearchUiViewType } from "../reducers/bookSearch/reducer";

import ComponentLoading from "applicationRoot/components/componentLoading";

import { Client, query, mutation } from "micro-graphql-react";

const client = new Client({
  endpoint: "/graphql",
  fetchOptions: { credentials: "include" },
  cacheSize: 3
});

@query(
  client,
  props => ({
    query: `
    query ALL_BOOKS ($page: Int) {
      allBooks(PAGE: $page, PAGE_SIZE: 3) {
        Books { 
          _id 
          title 
        }
      }
    }`,
    variables: {
      page: props.page
    }
  }),
  { shouldQueryUpdate: ({ props }) => props.page % 2 }
)
@mutation(
  client,
  `mutation modifyBook($_id: String, $title: String) {
    updateBook(_id: $_id, Updates: { title: $title }) {
      success
    }
  }`
)
class MutationAndQuery extends Component<any, any> {
  state = { editingId: "", editingOriginaltitle: "" };
  el: any;
  edit = book => {
    this.setState({ editingId: book._id, editingOriginaltitle: book.title });
  };
  render() {
    let { loading, loaded, data, reload, running, finished, runMutation, page } = this.props;
    let { editingId, editingOriginaltitle } = this.state;
    return (
      <div>
        {loading ? <div>LOADING</div> : null}
        {loaded ? <div>LOADED {page}</div> : null}
        <button onClick={reload}>Reload</button>
        {data ? (
          <ul>
            {data.allBooks.Books.map(book => (
              <li key={book._id}>
                {book.title}
                <button onClick={() => this.edit(book)}> edit</button>
              </li>
            ))}
          </ul>
        ) : null}

        {editingId ? (
          <div>
            {running ? <div>RUNNING</div> : null}
            {finished ? <div>SAVED</div> : null}
            <input defaultValue={editingOriginaltitle} ref={el => (this.el = el)} placeholder="New title here!" />
            <button onClick={() => runMutation({ _id: editingId, title: this.el.value })}>Save</button>
          </div>
        ) : null}
      </div>
    );
  }
}

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

type actionsType = typeof actionCreatorsBooks & typeof actionCreatorsSearch;
type mainSelectorType = bookSearchUiViewType &
  BookListType &
  BookSelectionType & {
    subjectsLoaded: boolean;
    tagsLoaded: boolean;
    editingBookSearchFilters: boolean;
  };

const mainSelector = createSelector<
  BooksModuleType,
  mainSelectorType,
  AppType,
  TagsType,
  bookSearchType,
  BookListType,
  BookSelectionType,
  bookSearchUiViewType
>(
  state => state.app,
  state => state.booksModule.tags,
  state => state.booksModule.bookSearch,
  selectBookList,
  selectBookSelection,
  selectBookSearchUiView,
  (app, tags, bookSearch, books, bookSelection, bookSearchUi) => {
    return {
      subjectsLoaded: app.subjectsLoaded,
      tagsLoaded: tags.loaded,
      editingBookSearchFilters: bookSearch.editingFilters,
      ...books,
      ...bookSearchUi,
      ...bookSelection
    };
  }
);

@connect(mainSelector, { ...actionCreatorsBooks, ...actionCreatorsSearch })
export default class BookViewingList extends Component<mainSelectorType & actionsType, any> {
  state = {
    navBarHeight: null,
    tagEditModalOpen: false,
    subjectEditModalOpen: false,
    booksSubjectModifying: null,
    booksTagModifying: null,
    isEditingBook: false,
    editingBookSaving: false,
    editingBook: null,
    page: 1,
    pageA: 1,
    pageB: 1
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
    this.setState({ editingBookSaving: true });
    Promise.resolve(this.props.saveEditingBook(book)).then(() => {
      this.setState({
        editingBookSaving: false,
        isEditingBook: false,
        editingBook: null
      });
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

    return (
      <div style={{ position: "relative" }}>
        {this.props.booksLoading || !this.props.subjectsLoaded || !this.props.tagsLoaded ? <Loading /> : null}
        <div className="panel panel-default" style={{ margin: "10px" }}>
          <BooksMenuBar
            startTagModification={this.editTagsForSelectedBooks}
            startSubjectModification={this.editSubjectsForSelectedBooks}
            editTags={this.editTags}
            editSubjects={this.editSubjects}
            navBarSized={this.navBarSized}
          />
          <div className="panel-body" style={{ padding: 0, minHeight: 450, position: "relative" }}>
            <br />
            <br />
            <button onClick={() => this.setState((state, props) => ({ pageA: state.pageA - 1 }))}>A prev</button>
            <button onClick={() => this.setState((state, props) => ({ pageA: state.pageA + 1 }))}>A next</button>
            <button onClick={() => this.setState((state, props) => ({ pageB: state.pageB - 1 }))}>B prev</button>
            <button onClick={() => this.setState((state, props) => ({ pageB: state.pageB + 1 }))}>B next</button>

            <MutationAndQuery page={this.state.pageA} />
            <MutationAndQuery page={this.state.pageB} />
            <br />
            <br />
            <br />
            <br />

            {!this.props.booksList.length && !this.props.booksLoading ? (
              <div className="alert alert-warning" style={{ borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0 }}>
                No books found
              </div>
            ) : null}

            {this.props.subjectsLoaded && this.props.tagsLoaded ? (
              this.props.isGridView ? (
                <GridView
                  editBook={this.editBook}
                  editBooksTags={this.editTagsForBook}
                  editBooksSubjects={this.editSubjectsForBook}
                  navBarHeight={this.state.navBarHeight}
                />
              ) : this.props.isBasicList ? (
                <BasicListView editBook={this.editBook} />
              ) : null
            ) : null}

            {this.state.isEditingBook ? (
              <ManualBookEntry
                title={editingBook ? `Edit ${editingBook.title}` : ""}
                dragTitle={dragTitle}
                bookToEdit={editingBook}
                isOpen={this.state.isEditingBook}
                isSaving={this.state.editingBookSaving}
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
