import React from 'react';
import { connect } from 'react-redux';
import BooksMenuBar from './booklist-menubar/booksMenuBar';
import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';

import * as actionCreatorsBooks from '../reducers/books/actionCreators';
import * as actionCreatorsBookSearch from '../reducers/bookSearch/actionCreators';
import * as actionCreatorsBookSubjectModification from '../reducers/booksSubjectModification/actionCreators';
import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';

import { selector } from '../reducers/reducer';

const BookViewListMobileItem = props => {
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

    return (
        <a className="list-group-item" style={{ cursor: 'pointer' }}>
            <div className="row">
                <div className="col-xs-3 col-sm-1">
                    <img src={props.smallImage} />
                </div>
                <div className="col-xs-9 col-sm-11">
                    <h4 className="list-group-item-heading">{props.title}</h4>
                    <p className="list-group-item-text">{props.authors.length ? <b>{props.authors.join(', ')}</b> : 'No author'}</p>
                    <div>
                        {publisherDisplay ? <p className="list-group-item-text">{publisherDisplay}</p> : null}
                        {isbnPages ? <p className="list-group-item-text">{isbnPages}</p> : null}
                    </div>
                </div>
            </div>
        </a>
    )
}
const BookViewListMobile = props => (
    <div>
        <div style={{ paddingBottom: 15 }}>
            <div style={{ border: 0 }} className="list-group docked-to-panel">
                { props.books.list.map((book, i) => <BookViewListMobileItem key={book._id} {...book} /> )}
            </div>
        </div>
    </div>
);

const BookViewListMobileConnected = connect(selector, { ...actionCreatorsBookSearch, ...actionCreatorsBooks, ...actionCreatorsBookSubjectModification, ...actionCreatorsEditBook })(BookViewListMobile);
export default BookViewListMobileConnected;
