import React from 'react';
import { connect } from 'react-redux';

import BootstrapButton, {AjaxButton} from 'applicationRoot/components/bootstrapButton';

import * as actionCreatorsBooks from '../reducers/books/actionCreators';
import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsBookSearch from '../reducers/bookSearch/actionCreators';
import * as actionCreatorsBookSubjectModification from '../reducers/booksSubjectModification/actionCreators';
import * as actionCreatorsBookTagModification from '../reducers/booksTagModification/actionCreators';
import { LabelDisplay } from 'applicationRoot/components/labelDisplay';

import { selector } from '../reducers/reducer';

@connect(selector, { ...actionCreatorsBooks, ...actionCreatorsBookSubjectModification, ...actionCreatorsEditBook, ...actionCreatorsBookSearch, ...actionCreatorsBookTagModification })
export default class BookViewListGrid extends React.Component{
    state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [], editingSubject: null };
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
            <div style={{ minHeight: 400 }}>
                { this.props.books.length ?
                <div>
                    { this.props.currentPage > 1 || this.props.hasMoreBooks ?
                        <div style={{ marginLeft: '10px', marginBottom: '10px' }}>
                            {this.props.currentPage > 1 ? <BootstrapButton style={{ marginRight: '10px' }} preset="primary-xs" onClick={this.props.pageDown}><i className="fa fa-fw fa-chevron-left"></i> Previous</BootstrapButton> : null}
                            {this.props.hasMoreBooks ? <BootstrapButton preset="primary-xs" onClick={this.props.pageUp}>Next <i className="fa fa-fw fa-chevron-right"></i></BootstrapButton> :  null}
                        </div> : null }
                    <table className="table table-striped no-padding-top">
                        <thead style={{position: 'sticky', top: 100, backgroundColor: 'white', zIndex: 498}}>
                            <tr>
                                <th><input type="checkbox" checked={this.props.allAreChecked} onClick={this.props.toggleCheckAll} disabled={this.props.viewingPublic} /></th>
                                <th></th>
                                <th><a className="no-underline" onClick={() => this.setSort('title')}>Title {sortIconIf('title')}</a></th>
                                <th>Author</th>
                                <th>Subjects</th>
                                <th>Tags</th>
                                <th style={{ minWidth: '90px' }}>Read?</th>
                                <th>Published</th>
                                <th>ISBN</th>
                                <th style={{ minWidth: '85px' }}><a className="no-underline" onClick={() => this.setSort('pages')}>Pages {sortIconIf('pages')}</a></th>
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
                                <td>
                                    {book.title}
                                    <br />
                                    { !this.props.viewingPublic ? <a className="grid-hover-filter inline-filter" onClick={() => this.props.editBook(book)}><i style={{ display: book.pendingDelete ? 'inline' : '' }} className="fa fa-fw fa-pencil show-on-hover-parent-td"></i></a> : null }
                                    { !this.props.viewingPublic ? <a className="grid-hover-filter inline-filter" onClick={() => this.props.setPendingDeleteBook(book)}><i style={{ display: book.pendingDelete ? 'inline' : '' }} className="margin-left fa fa-fw fa-trash show-on-hover-parent-td"></i></a> : null }
                                    { book.pendingDelete ? <AjaxButton running={book.deleting} runningText="Deleting" onClick={() => this.props.deleteBook(book)} className="margin-left btn btn-xs btn-danger">Confirm delete</AjaxButton> : null }
                                    { book.pendingDelete ? <button onClick={() => this.props.cancelPendingDeleteBook(book)} className="margin-left btn btn-xs btn-primary">Cancel</button> : null }
                                </td>
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
                                <td>
                                    <div style={{ marginTop: 5 }}> { !!book.isRead
                                        ? <AjaxButton running={!!book.readChanging} runningText=" " onClick={() => this.props.setUnRead(book._id)} preset="success-xs">Read <i className="fa fa-fw fa-check"></i></AjaxButton>
                                        : <AjaxButton running={!!book.readChanging} runningText=" " onClick={() => this.props.setRead(book._id)} preset="default-xs">Set read</AjaxButton>
                                    }
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

                    { this.props.currentPage > 1 || this.props.hasMoreBooks ?
                        <div style={{ marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}>
                            {this.props.currentPage > 1 ? <BootstrapButton style={{ marginRight: '10px' }} preset="primary-xs" onClick={this.props.pageDown}><i className="fa fa-fw fa-chevron-left"></i> Previous</BootstrapButton> : null}
                            {this.props.hasMoreBooks ? <BootstrapButton preset="primary-xs" onClick={this.props.pageUp}>Next <i className="fa fa-fw fa-chevron-right"></i></BootstrapButton> :  null}
                        </div> : null }

                </div> : null }
            </div>
        );
    }
}