import {booksModuleType, appType, booksType, bookSearchType, booksSubjectMofificationType, booksTagModificationType, editBookType, subjectsType, tagsType} from 'modules/books/reducers/reducer';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import GV from './bookViewList-grid';
const GridView : any = GV;

import BLV from './bookViewList-basicList';
const BasicListView : any = BLV;

import BMB from './booksMenuBar';
const BooksMenuBar : any = BMB;

import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsSearch from '../reducers/bookSearch/actionCreators';
import Loading from 'applicationRoot/components/loading';
import Loadable from 'react-loadable';

import {booksListType, selectBookList} from '../reducers/books/reducer';
import {selectModifyingBooks as subjectsBooksModifyingSelector, modifyingBooksType as subjectsBooksModifyingType} from '../reducers/booksSubjectModification/reducer';
import {modifyingBooksSelector as tagsBooksModifyingSelector, modifyingBooksType as tagsBooksModifyingType} from '../reducers/booksTagModification/reducer';
import {selectBookSearchUiView, bookSearchUiViewType} from '../reducers/bookSearch/reducer';

import ComponentLoading from 'applicationRoot/components/componentLoading';

const ManualBookEntry = Loadable({
    loader: () => System.import('applicationRoot/components/manualBookEntry'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const BookSubjectSetter = Loadable({
    loader: () => System.import('./bookSubjectSetter'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const BookTagSetter = Loadable({
    loader: () => System.import('./bookTagSetter'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const SubjectEditModal = Loadable({
    loader: () => System.import('./subjectEditModal'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const TagEditModal = Loadable({
    loader: () => System.import('./tagEditModal'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const BookSearchModal = Loadable({
    loader: () => System.import('./bookSearchModal'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

type actionsType = typeof actionCreatorsEditBook & typeof actionCreatorsSearch;
type mainSelectorType = editBookType & bookSearchUiViewType & booksListType & {
    subjectsLoaded: boolean;
    subjectEditModalOpen: boolean;
    tagsLoaded: boolean;
    tagEditModalOpen: boolean;
    editingBookSearchFilters: boolean;
    subjectsBooksModifyingCount: number;
    tagsBooksModifyingCount: number;
}

const mainSelector = createSelector<booksModuleType, mainSelectorType, appType, editBookType, subjectsType, tagsType, bookSearchType, booksListType, bookSearchUiViewType, subjectsBooksModifyingType, tagsBooksModifyingType>(
    state => state.app,
    state => state.booksModule.editBook,
    state => state.booksModule.subjects,
    state => state.booksModule.tags,
    state => state.booksModule.bookSearch,
    selectBookList,
    selectBookSearchUiView,
    subjectsBooksModifyingSelector,
    tagsBooksModifyingSelector,
    (app, editBook, subjects, tags, bookSearch, books, bookSearchUi, subjectsBooksModifying, tagsBooksModifying) => {
        return {
            subjectsLoaded: app.subjectsLoaded,
            ...editBook,
            subjectEditModalOpen: subjects.editModalOpen,
            tagsLoaded: tags.loaded,
            tagEditModalOpen: tags.editTagOpen,
            editingBookSearchFilters: bookSearch.editingFilters,
            ...books,
            ...bookSearchUi,
            subjectsBooksModifyingCount: subjectsBooksModifying.length,
            tagsBooksModifyingCount: tagsBooksModifying.length          
        };
    }
);

@connect(mainSelector, { ...actionCreatorsEditBook, ...actionCreatorsSearch })
export default class BookViewingList extends Component<mainSelectorType & actionsType, any> {
    render() {
        let editingBook = this.props.editingBook,
            dragTitle = editingBook ? `Click or drag to upload a ${editingBook.smallImage ? 'new' : ''} cover image.  The uploaded image will be scaled down as needed` : '';

        return (
            <div>
                <div className="panel panel-default" style={{ margin: '10px' }}>
                    <BooksMenuBar />

                    <div className="panel-body" style={{ padding: 0, minHeight: 450, position: 'relative' }}>
                        {this.props.booksLoading || !this.props.subjectsLoaded || !this.props.tagsLoaded ?
                            <Loading /> : null }

                        {(!this.props.booksList.length && !this.props.booksLoading) ?
                            <div className="alert alert-warning" style={{borderLeftWidth: 0, borderRightWidth: 0, borderRadius: 0}}>
                                No books found
                            </div> : null }

                        {this.props.subjectsLoaded && this.props.tagsLoaded ?
                            (this.props.isGridView ? <GridView />
                                : this.props.isBasicList ? <BasicListView />
                                : null) : null }

                        {this.props.isEditingBook ? 
                            <ManualBookEntry
                                title={editingBook ? `Edit ${editingBook.title}` : ''}
                                dragTitle={dragTitle}
                                bookToEdit={editingBook}
                                isOpen={this.props.isEditingBook}
                                isSaving={this.props.editingBookSaving}
                                isSaved={this.props.editingBookSaved}
                                saveBook={book => this.props.saveEditingBook(book)}
                                saveMessage={'Saved'}
                                onClosing={this.props.stopEditingBook} /> : null
                        }
                        
                    </div>
                </div>
                <br />
                <br />

                {this.props.subjectsBooksModifyingCount ? <BookSubjectSetter /> : null}
                {this.props.tagsBooksModifyingCount ? <BookTagSetter /> : null}

                {this.props.subjectEditModalOpen ? <SubjectEditModal /> : null}
                {this.props.tagEditModalOpen ? <TagEditModal /> : null}
                {this.props.editingBookSearchFilters ? <BookSearchModal /> : null}
            </div>
        );
    }
}