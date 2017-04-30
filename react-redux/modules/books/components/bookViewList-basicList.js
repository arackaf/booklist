import React, {Component} from 'react';
import { connect } from 'react-redux';
import BootstrapButton, {AjaxButton} from 'applicationRoot/components/bootstrapButton';

import * as actionCreatorsBooks from '../reducers/books/actionCreators';
import * as actionCreatorsBookSearch from '../reducers/bookSearch/actionCreators';
import * as actionCreatorsBookSubjectModification from '../reducers/booksSubjectModification/actionCreators';
import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsBookTagModification from '../reducers/booksTagModification/actionCreators';

import { selector } from '../reducers/reducer';

@connect(selector, { ...actionCreatorsBooks, ...actionCreatorsEditBook })
class BookViewListMobileItem extends Component {
    render(){
        let props = this.props;

        let publisherDisplay = null,
            isbnPages = null;
        if (props.publisher || props.publicationDate) {
            publisherDisplay = [props.publisher, props.publicationDate].filter(s => s).join(' ');
        }
        if (props.isbn || props.pages){
            isbnPages = [
                props.pages ? `${props.pages} pages` : null,
                props.isbn ? `ISBN ${props.isbn}` : null
            ].filter(o => o).join('; ');
        }

        let book = props.book;

        return (
            <span className="list-group-item" style={{ cursor: 'pointer' }}>
                <div className="row">
                    <div className="col-xs-3 col-sm-1">
                        <img src={book.smallImage} />
                    </div>
                    <div className="col-xs-9 col-sm-11">
                        <h4 className="list-group-item-heading">{book.title}</h4>
                        <p className="list-group-item-text">{book.authors.length ? <b>{book.authors.join(', ')}</b> : 'No author'}</p>
                        <div>
                            {publisherDisplay ? <p className="list-group-item-text">{publisherDisplay}</p> : null}
                            {isbnPages ? <p className="list-group-item-text">{isbnPages}</p> : null}

                            { !props.viewingPublic ? <button className="btn btn-primary btn-xs" onClick={() => props.editBook(book)}><i className="fa fa-fw fa-pencil"></i></button> : null }
                            { !props.viewingPublic ? <button className="margin-left btn btn-danger btn-xs" onClick={() => props.setPendingDeleteBook(book)}><i className="fa fa-fw fa-trash"></i></button> : null }
                            { book.pendingDelete ? <AjaxButton running={book.deleting} runningText="Deleting" onClick={() => props.deleteBook(book)} className="margin-left btn btn-xs btn-danger">Confirm delete</AjaxButton> : null }
                            { book.pendingDelete ? <button onClick={() => props.cancelPendingDeleteBook(book)} className="margin-left btn btn-xs btn-primary">Cancel</button> : null }
                        </div>
                    </div>
                </div>
            </span>
        );
    }
}

@connect(selector, { ...actionCreatorsBooks, ...actionCreatorsBookSubjectModification, ...actionCreatorsEditBook, ...actionCreatorsBookSearch, ...actionCreatorsBookTagModification })
export default class BookViewListMobile extends Component {
    render(){ 
        let props = this.props;
        return (
            <div>
                { props.currentPage > 1 || props.hasMoreBooks ?
                    <div style={{ marginLeft: '10px', marginBottom: '10px' }}>
                        {props.currentPage > 1 ? <BootstrapButton style={{ marginRight: '10px' }} preset="primary-xs" onClick={props.pageDown}><i className="fa fa-fw fa-chevron-left"></i> Previous</BootstrapButton> : null}
                        {props.hasMoreBooks ? <BootstrapButton preset="primary-xs" onClick={props.pageUp}>Next <i className="fa fa-fw fa-chevron-right"></i></BootstrapButton> :  null}
                    </div> : null }

                <div style={{ paddingBottom: 15 }}>
                    <div style={{ border: 0 }} className="list-group docked-to-panel">
                        { props.booksList.map((book, i) => <BookViewListMobileItem key={book._id} book={book} viewingPublic={props.viewingPublic} /> )}
                    </div>
                </div>

                { props.currentPage > 1 || props.hasMoreBooks ?
                    <div style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}>
                        {props.currentPage > 1 ? <BootstrapButton style={{ marginRight: '10px' }} preset="primary-xs" onClick={props.pageDown}><i className="fa fa-fw fa-chevron-left"></i> Previous</BootstrapButton> : null}
                        {props.hasMoreBooks ? <BootstrapButton preset="primary-xs" onClick={props.pageUp}>Next <i className="fa fa-fw fa-chevron-right"></i></BootstrapButton> :  null}
                    </div> : null
                }

            </div>
        );
    }
}