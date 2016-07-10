import React from 'react';
import { connect} from 'react-redux';
import { loadSubjects } from '../reducers/subjects/actionCreators';
import { loadBooks } from '../reducers/books/actionCreators';

import DesktopView from './bookViewList-desktop';
import MobileView from './bookViewList-mobile';

import MainNavigationBar from 'applicationRoot/rootComponents/mainNavigation';
import BooksMenuBar from './booklist-menubar/booksMenuBar';
import BookSubjectSetter from './bookSubjectSetter';
import SubjectEditModal from './subject-edit/subjectEditModal';
import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';
import ManualBookEntry from 'applicationRoot/rootComponents/manualBookEntry';

import * as actionCreatorsSubjects from '../reducers/subjects/actionCreators';
import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsUi from '../reducers/ui/actionCreators';
import * as actionCreatorsSearch from '../reducers/bookSearch/actionCreators';

import { selector } from '../reducers/reducer';
import { globalHashManager } from 'reactStartup';

class BookViewingList extends React.Component {
    constructor(props){
        super();

        let viewingUserId = globalHashManager.getCurrentHashValueOf('userId');
        if (viewingUserId){
            props.setViewingUserId(viewingUserId);
        }
    }
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
        this.props.loadSubjects();
    }
    render() {
        let editingBook = this.props.editingBook,
            dragTitle = editingBook ? `Click or drag to upload a ${editingBook.smallImage ? 'new' : ''} cover image.  The uploaded image will be scaled down as needed` : '';

        return (
            <div>
                <MainNavigationBar isBookList={true}></MainNavigationBar>
                <div className="panel panel-default" style={{ margin: '10px' }}>
                    <BooksMenuBar />

                    <div className="panel-body" style={{ padding: 0, minHeight: 550, position: 'relative' }}>
                        { this.props.booksLoading || !this.props.subjectsLoaded ?
                            <div className="wait-for-loading">
                                <i className="fa fa-5x fa-spin fa-spinner"></i>
                            </div> : null }

                        {(!this.props.books.length && !this.props.booksLoading) ?
                            <div className="alert alert-warning">
                                No books found
                            </div> : null }

                        {this.props.subjectsLoaded ?
                            (this.props.isDesktop ? <DesktopView />
                                : this.props.isMobile ? <MobileView />
                                : null) : null }
                    </div>
                </div>
                <div className="well well-sm">
                    <img width="16" height="16" src="/static/main-icon.png" />
                    <span>Track my books</span>
                </div>

                <BookSubjectSetter />
                <SubjectEditModal />

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

const BookViewingListConnected = connect(selector, { ...actionCreatorsEditBook, ...actionCreatorsSubjects, ...actionCreatorsUi, ...actionCreatorsSearch })(BookViewingList);
export default BookViewingListConnected;