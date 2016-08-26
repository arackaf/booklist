import React from 'react';
import { connect } from 'react-redux';
import BootstrapButton from 'applicationRoot/components/bootstrapButton';

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

        { props.currentPage > 1 || props.hasMoreBooks ?
            <div style={{ marginLeft: '10px', marginBottom: '10px' }}>
                {props.currentPage > 1 ? <BootstrapButton style={{ marginRight: '10px' }} preset="primary-xs" onClick={props.pageDown}><i className="fa fa-fw fa-chevron-left"></i> Previous</BootstrapButton> : null}
                {props.hasMoreBooks ? <BootstrapButton preset="primary-xs" onClick={props.pageUp}>Next <i className="fa fa-fw fa-chevron-right"></i></BootstrapButton> :  null}
            </div> : null }

        <div style={{ paddingBottom: 15 }}>
            <div style={{ border: 0 }} className="list-group docked-to-panel">
                { props.books.map((book, i) => <BookViewListMobileItem key={book._id} {...book} /> )}
            </div>
        </div>

        { props.currentPage > 1 || props.hasMoreBooks ?
            <div style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}>
                {props.currentPage > 1 ? <BootstrapButton style={{ marginRight: '10px' }} preset="primary-xs" onClick={props.pageDown}><i className="fa fa-fw fa-chevron-left"></i> Previous</BootstrapButton> : null}
                {props.hasMoreBooks ? <BootstrapButton preset="primary-xs" onClick={props.pageUp}>Next <i className="fa fa-fw fa-chevron-right"></i></BootstrapButton> :  null}
            </div> : null }

    </div>
);

const BookViewListMobileConnected = connect(selector, { ...actionCreatorsBookSearch, ...actionCreatorsBooks, ...actionCreatorsBookSubjectModification, ...actionCreatorsEditBook })(BookViewListMobile);
export default BookViewListMobileConnected;
