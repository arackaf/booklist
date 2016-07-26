import React from 'react';
import { connect } from 'react-redux';

import * as actionCreatorsBooks from '../reducers/books/actionCreators';
import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsBookSearch from '../reducers/bookSearch/actionCreators';
import * as actionCreatorsBookSubjectModification from '../reducers/booksSubjectModification/actionCreators';
import * as actionCreatorsBookTagModification from '../reducers/booksTagModification/actionCreators';
import { LabelDisplay } from 'applicationRoot/components/labelDisplay';

import { selector } from '../reducers/reducer';

class BookViewListDesktop extends React.Component{
    constructor(props){
        super();

        this.state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [], editingSubject: null };
    }
    setSort(column){
        let currentSort = this.props.currentSort;
        let newDirection = 1;
        if (currentSort === column){
            newDirection = this.props.sortDirection == 1 ? -1 : 1;
        }

        this.props.setSortOrder(column, newDirection);
    }
    render(){
        let potentialSortIcon = <i className={'fa fa-angle-' + (this.props.sortDirection == 1 ? 'up' : 'down')}></i>,
            sortIconIf = column => column == this.props.currentSort ? potentialSortIcon : null;

        return (
            <div style={{ minHeight: 500 }}>
                { this.props.books.length ?
                <div>
                    <table className="table table-striped no-padding-top">
                        <thead>
                            <tr>
                                <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                <th></th>
                                <th><a className="no-underline" onClick={() => this.setSort('title')}>Title {sortIconIf('title')}</a></th>
                                <th>Author</th>
                                <th>Subjects</th>
                                <th>Tags</th>
                                <th>Published</th>
                                <th>ISBN</th>
                                <th><a className="no-underline" onClick={() => this.setSort('pages')}>Pages {sortIconIf('pages')}</a></th>
                                <th><a className="no-underline" onClick={() => this.setSort('_id')}>Added {sortIconIf('_id')}</a></th>
                            </tr>
                        </thead>
                        <tbody>
                        { this.props.books.map(book =>
                            <tr key={book._id}>
                                <td>
                                    <input type="checkbox" onClick={() => this.props.toggleSelectBook(book._id)} checked={!!this.props.selectedBooks[book._id]} disabled={this.props.viewingPublic} />
                                </td>
                                <td><img src={book.smallImage} /></td>
                                <td>{book.title}<br />{ !this.props.viewingPublic ? <a onClick={() => this.props.editBook(book)}><i className="fa fa-fw fa-pencil show-on-hover-parent-td"></i></a> : null }</td>
                                <td>
                                    <ul className="list-unstyled">
                                        {book.authors.map(author => <li>{author}</li>)}
                                    </ul>
                                </td>
                                <td>
                                    { book.subjectObjects.map(s => <div><LabelDisplay item={s} /></div>) }
                                    <div style={{ marginTop: 5, minHeight: 40 }}>
                                        <button className="btn btn-default btn-xs" onClick={() => this.props.enableSubjectModificationSingleBook(book._id)} disabled={this.props.viewingPublic}>Modify</button>
                                    </div>
                                </td>
                                <td>
                                    { book.tagObjects.map(s => <div><LabelDisplay item={s} /></div>) }
                                    <div style={{ marginTop: 5, minHeight: 40 }}>
                                        <button className="btn btn-default btn-xs" onClick={() => this.props.enableTagModificationSingleBook(book._id)} disabled={this.props.viewingPublic}>Modify</button>
                                    </div>
                                </td>
                                <td>{book.publisher}{book.publisher ? <br /> : null}{book.publicationDate}</td>
                                <td>{book.isbn}</td>
                                <td>{book.pages}</td>
                                <td>{book.dateAddedDisplay}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div> : null }
            </div>
        );
    }
}

const BookEntryListConnected = connect(selector, { ...actionCreatorsBooks, ...actionCreatorsBookSubjectModification, ...actionCreatorsEditBook, ...actionCreatorsBookSearch, ...actionCreatorsBookTagModification })(BookViewListDesktop);
export default BookEntryListConnected;