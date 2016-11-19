import React from 'react';
import { connect} from 'react-redux';

import GridView from './bookViewList-grid';
import BasicListView from './bookViewList-basicList';

import MainNavigationBar from 'applicationRoot/components/mainNavigation';
import BooksMenuBar from './booksMenuBar';
import BookSubjectSetter from './bookSubjectSetter';
import BookTagSetter from './bookTagSetter';
import SubjectEditModal from './subjectEditModal';
import TagEditModal from './tagEditModal';
import BootstrapButton from 'applicationRoot/components/bootstrapButton';
import ManualBookEntry from 'applicationRoot/components/manualBookEntry';

import * as actionCreatorsBooks from '../reducers/books/actionCreators';
import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsSearch from '../reducers/bookSearch/actionCreators';

import { selector } from '../reducers/reducer';
import { globalHashManager } from 'reactStartup';

class BookViewingList extends React.Component {
    render() {
        let editingBook = this.props.editingBook,
            dragTitle = editingBook ? `Click or drag to upload a ${editingBook.smallImage ? 'new' : ''} cover image.  The uploaded image will be scaled down as needed` : '';

        return (
            <div>
                <MainNavigationBar isBookList={true}></MainNavigationBar>
                <div className="panel panel-default" style={{ margin: '10px' }}>
                    <BooksMenuBar />

                    <div className="panel-body" style={{ padding: 0, minHeight: 450, position: 'relative' }}>
                        { this.props.booksLoading || !this.props.subjectsLoaded || !this.props.tagsLoaded ?
                            <div className="wait-for-loading">
                                <i className="fa fa-5x fa-spin fa-spinner"></i>
                            </div> : null }

                        {(!this.props.books.length && !this.props.booksLoading) ?
                            <div className="alert alert-warning">
                                No books found
                            </div> : null }

                        {this.props.subjectsLoaded && this.props.tagsLoaded ?
                            (this.props.isGridView ? <GridView />
                                : this.props.isBasicList ? <BasicListView />
                                : null) : null }
                    </div>
                </div>

                <BookSubjectSetter />
                <BookTagSetter />
                <SubjectEditModal />
                <TagEditModal />

                <ManualBookEntry
                    title={editingBook ? `Edit ${editingBook.title}` : ''}
                    dragTitle={dragTitle}
                    bookToEdit={editingBook}
                    isOpen={this.props.isEditingBook}
                    isSaving={this.props.editingBookSaving}
                    isSaved={this.props.editingBookSaved}
                    saveBook={book => this.props.saveEditingBook(book)}
                    saveMessage={'Saved'}
                    onClosing={this.props.stopEditingBook} />
            </div>
        );
    }
}
const BookViewingListConnected = connect(selector, { ...actionCreatorsEditBook, ...actionCreatorsSearch })(BookViewingList);

export default BookViewingListConnected;