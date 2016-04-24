const Modal = ReactBootstrap.Modal;

import BooksMenuBar from './booklist-menubar/booksMenuBar';
import BookSubjectSetterDesktop from './bookSubjectSetter-desktop';
import SubjectEditModal from './subject-edit/subjectEditModal';
import BootstrapButton from '/react-redux/applicationRoot/rootComponents/bootstrapButton';

class BookViewListDesktop extends React.Component{
    constructor(props){
        super();

        this.state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [], editingSubject: null };
    }
    render(){
        let editSubjectsPacket = this.props.subjects.editSubjectsPacket;
        return (
            <div>
                <BooksMenuBar
                    selectedBooksCount={this.props.books.selectedBooksCount}
                    allSubjects={this.props.subjects.list}
                ></BooksMenuBar>

                { this.props.books.list.length ?
                <div style={{ paddingLeft: 15, paddingRight: 15, paddingBottom: 15 }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                <th></th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genres</th>
                                <th>ISBN</th>
                                <th>Published</th>
                                <th>Pages</th>
                            </tr>
                        </thead>
                        <tbody>
                        { this.props.subjects.loaded ? this.props.books.list.map(book =>
                            <tr key={book._id}>
                                <td>
                                    <input type="checkbox" onClick={() => this.props.toggleSelectBook(book._id)} checked={this.props.books.selectedBooks[book._id]} />
                                </td>
                                <td><img src={book.smallImage} /></td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>
                                    { book.subjectObjects.map(s => <div key={s._id}><span className="label label-default">{s.name}</span></div>) }
                                    <div style={{ marginTop: 5 }}>
                                        <button className="btn btn-default btn-xs" onClick={() => this.props.enableSubjectModificationSingleBook(book._id)}>Modify</button>
                                    </div>
                                </td>
                                <td>{book.isbn}</td>
                                <td>{book.publicationDate}</td>
                                <td>{book.pages}</td>
                            </tr>
                        ) : null}
                        </tbody>
                    </table>
                </div>
                : (this.props.loading ?
                <div className="alert alert-warning">
                    No books found
                </div> : null)
                }
                <BookSubjectSetterDesktop subjects={this.props.subjects}></BookSubjectSetterDesktop>
                <SubjectEditModal
                    editSubjectsPacket={this.props.subjects.editSubjectsPacket}
                    subjects={this.props.subjects.list}>
                </SubjectEditModal>


            </div>
        );
    }
}

export default BookViewListDesktop;