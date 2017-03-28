import React from 'react';
import {connect} from 'react-redux';

import GridView from './bookViewList-grid';
import BasicListView from './bookViewList-basicList';

import BooksMenuBar from './booksMenuBar';

import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsSearch from '../reducers/bookSearch/actionCreators';
import Loading from 'applicationRoot/components/loading';
import Loadable from 'react-loadable';

import { selector } from '../reducers/reducer';

const ManualBookEntry = Loadable({
    loader: () => System.import('applicationRoot/components/manualBookEntry'),
    LoadingComponent: Loading,
    delay: 1
});

const BookSubjectSetter = Loadable({
    loader: () => System.import('./bookSubjectSetter'),
    LoadingComponent: Loading,
    delay: 1
});

const BookTagSetter = Loadable({
    loader: () => System.import('./bookTagSetter'),
    LoadingComponent: Loading,
    delay: 1
});

const SubjectEditModal = Loadable({
    loader: () => System.import('./subjectEditModal'),
    LoadingComponent: Loading,
    delay: 1
});

const TagEditModal = Loadable({
    loader: () => System.import('./tagEditModal'),
    LoadingComponent: Loading,
    delay: 1
});

const BookSearchModal = Loadable({
    loader: () => System.import('./bookSearchModal'),
    LoadingComponent: Loading,
    delay: 1
});


@connect(selector, { ...actionCreatorsEditBook, ...actionCreatorsSearch })
export default class BookViewingList extends React.Component {
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

                        {(!this.props.books.length && !this.props.booksLoading) ?
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