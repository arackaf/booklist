import React from 'react';
import { connect} from 'react-redux';

import DesktopView from './bookViewList-desktop';
import MobileView from './bookViewList-mobile';

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
import * as actionCreatorsUi from '../reducers/ui/actionCreators';
import * as actionCreatorsSearch from '../reducers/bookSearch/actionCreators';

import { selector } from '../reducers/reducer';
import { globalHashManager } from 'reactStartup';

class BookViewingList extends React.Component {
    componentDidMount(){
        try {
            if (window.screen.width < 700) {
                this.props.setMobile();
            } else {
                this.props.setDesktop();
            }
        }catch(err){
            this.props.setDesktop();
        }

        this.props.booksActivated(this.props.hashParameters);
    }
    componentDidUpdate(prevProps){
        if (this.props.hashParameters !== prevProps.hashParameters){
            this.props.syncFiltersToHash(this.props.hashParameters);
        }
    }
    render() {
        let editingBook = this.props.editingBook,
            dragTitle = editingBook ? `Click or drag to upload a ${editingBook.smallImage ? 'new' : ''} cover image.  The uploaded image will be scaled down as needed` : '';
        
        return (
            <div>
                <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=3.0; user-scalable=1;" />

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
                            (this.props.showingDesktop ? <DesktopView />
                                : this.props.showingMobile ? <MobileView />
                                : null) : null }
                    </div>
                </div>
                <div className="well well-sm">
                    <img width="16" height="16" src="/static/main-icon.png" />
                    <span>Track my books</span>
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
const BookViewingListConnected = connect(selector, { ...actionCreatorsEditBook, ...actionCreatorsUi, ...actionCreatorsSearch })(BookViewingList);

export default BookViewingListConnected;