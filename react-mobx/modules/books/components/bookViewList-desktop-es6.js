import React from 'react';
import { observer } from "mobx-react";
import BookStore from '../model/bookStore';

function sortIconIf(arg){
    return '';
    return arg;
}

@observer
class BookViewListDesktop extends React.Component{
    render(){
        return (
            <div style={{ minHeight: 500 }}>
                { this.props.store.books.length ?
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
                            { this.props.store.books.map(book =>
                                <tr key={book._id}>
                                    <td>
                                        { <input type="checkbox" onClick={book.toggle} checked={book.selected} /> }
                                    </td>
                                    <td><img src={book.smallImage} /></td>
                                    <td>{book.title}<br />{ !this.props.viewingPublic ? <a onClick={() => this.props.editBook(book)}><i className="fa fa-fw fa-pencil show-on-hover-parent-td"></i></a> : null }</td>
                                    <td>
                                        <ul className="list-unstyled">
                                            {book.authors.map(author => <li>{author}</li>)}
                                        </ul>
                                    </td>
                                    <td>
                                        { book.subjectObjects.map(s => <div>{null && <LabelDisplay item={s} />}</div>) }
                                        <div style={{ marginTop: 5, minHeight: 40 }}>
                                            <button className="btn btn-default btn-xs" onClick={() => this.props.enableSubjectModificationSingleBook(book._id)} disabled={this.props.viewingPublic}>Modify</button>
                                        </div>
                                    </td>
                                    <td>
                                        { book.tagObjects.map(s => <div>{null && <LabelDisplay item={s} />}</div>) }
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

export default BookViewListDesktop;