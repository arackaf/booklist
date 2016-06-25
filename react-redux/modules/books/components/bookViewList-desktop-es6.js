import React from 'react';
import { connect } from 'react-redux';

import * as actionCreatorsBooks from '../reducers/books/actionCreators';
import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsBookSearch from '../reducers/bookSearch/actionCreators';
import * as actionCreatorsBookSubjectModification from '../reducers/booksSubjectModification/actionCreators';

import { selector } from '../reducers/reducer';

class BookViewListDesktop extends React.Component{
    constructor(props){
        super();

        this.state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [], editingSubject: null };
    }
    setSort(column){
        let currentSort = this.props.bookSearch.sort;
        let newDirection = 1;
        if (currentSort === column){
            newDirection = this.props.bookSearch.sortDirection == 1 ? -1 : 1;
        }

        this.props.setSortOrder(column, newDirection);
    }
    render(){
        let potentialSortIcon = <i className={'fa fa-angle-' + (this.props.bookSearch.sortDirection == 1 ? 'up' : 'down')}></i>,
            sortIconIf = column => column == this.props.bookSearch.sort ? potentialSortIcon : null;

        return (
            <div style={{ minHeight: 500 }}>
                { this.props.books.list.length ?
                <div style={{ paddingLeft: 15, paddingRight: 15, paddingBottom: 15 }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                <th></th>
                                <th><a className="no-underline" onClick={() => this.setSort('title')}>Title {sortIconIf('title')}</a></th>
                                <th>Author</th>
                                <th>Genres</th>
                                <th>Published</th>
                                <th>ISBN</th>
                                <th><a className="no-underline" onClick={() => this.setSort('pages')}>Pages {sortIconIf('pages')}</a></th>
                                <th><a className="no-underline" onClick={() => this.setSort('_id')}>Added {sortIconIf('_id')}</a></th>
                            </tr>
                        </thead>
                        <tbody>
                        { this.props.subjects.loaded ? this.props.books.list.map(book =>
                            <tr key={book._id}>
                                <td>
                                    <input type="checkbox" onClick={() => this.props.toggleSelectBook(book._id)} checked={this.props.books.selectedBooks[book._id]} />
                                </td>
                                <td><img src={book.smallImage} /></td>
                                <td>{book.title}<br /><a onClick={() => this.props.editBook(book)}><i className="fa fa-fw fa-pencil show-on-hover-parent-td"></i></a></td>
                                <td>
                                    <ul className="list-unstyled">
                                        {book.authors.map(author => <li>{author}</li>)}
                                    </ul>
                                </td>
                                <td>
                                    { book.subjectObjects.map(s => <div key={s._id}><span className="label label-default">{s.name}</span></div>) }
                                    <div style={{ marginTop: 5, minHeight: 40 }}>
                                        <button className="btn btn-default btn-xs" onClick={() => this.props.enableSubjectModificationSingleBook(book._id)}>Modify</button>
                                    </div>
                                </td>
                                <td>{book.publisher}{book.publisher ? <br /> : null}{book.publicationDate}</td>
                                <td>{book.isbn}</td>
                                <td>{book.pages}</td>
                                <td>{book.dateAddedDisplay}</td>
                            </tr>
                        ) : null}
                        </tbody>
                    </table>
                </div>
                : (!this.props.books.loading ?
                    <div className="alert alert-warning">
                        No books found
                    </div> : null)
                }
            </div>
        );
    }
}

const BookEntryListConnected = connect(selector, { ...actionCreatorsBooks, ...actionCreatorsBookSubjectModification, ...actionCreatorsEditBook, ...actionCreatorsBookSearch })(BookViewListDesktop);
export default BookEntryListConnected;