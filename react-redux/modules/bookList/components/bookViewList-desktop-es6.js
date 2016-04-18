const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const Modal = ReactBootstrap.Modal;
const HierarchicalSubjectList = require('./hierarchicalSubjectList');

import BookFilters from './bookSearch';
import BookSubjectSetterDesktop from './BookSubjectSetter-desktop';

class BookViewListDesktop extends React.Component{
    constructor(props){
        super();

        this.state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [], editingSubject: null };
    }
    render(){
        let editSubjectsPacket = this.props.subjects.editSubjectsPacket;
        return (
            <div>
                <BookFilters
                    selectedBooksCount={this.props.books.selectedBooksCount}
                    allSubjects={this.props.subjects.list}
                ></BookFilters>

                { this.props.books.list.length ?
                <div style={{ paddingLeft: 15, paddingRight: 15, paddingBottom: 15 }}>
                    <BootstrapButton preset="primary-sm" onClick={this.props.enableSubjectModificationToggledBooks}>Set subjects</BootstrapButton>
                    &nbsp;&nbsp;&nbsp;
                    <BootstrapButton preset="primary-sm" onClick={this.props.editSubjects}>Edit subjects</BootstrapButton>
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
                :
                <div className="alert alert-warning">
                    No books found
                </div>
                }
                <BookSubjectSetterDesktop subjects={this.props.subjects}></BookSubjectSetterDesktop>

                <Modal show={!!editSubjectsPacket} onHide={this.props.stopEditingSubjects}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit subjects
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <BootstrapButton onClick={this.props.newSubject} preset="primary">New subject</BootstrapButton>
                        <br />
                        <HierarchicalSubjectList subjects={this.props.subjects.list} onEdit={_id => this.props.editSubject(_id)} />

                        { editSubjectsPacket && editSubjectsPacket.editing ?
                            <div>
                                { this.props.subjects.editSubjectsPacket.editingSubject ? `Edit subject ${this.props.subjects.editSubjectsPacket.editingSubject.name}` : 'New Subject' }
                                <br/>
                                New name: <input value={this.props.subjects.editSubjectsPacket.newSubjectName} onChange={(e) => this.props.setNewSubjectName(e.target.value)} />
                                New Parent:
                                <select value={this.props.subjects.editSubjectsPacket.newSubjectParent} onChange={(e) => this.props.setNewSubjectParent(e.target.value)}>
                                    <option value="">None</option>
                                    { this.props.subjects.editSubjectsPacket.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                </select>
                                <BootstrapButton onClick={this.props.createOrUpdateSubject}>Save</BootstrapButton>
                            </div>
                            : null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.props.stopEditingSubjects}>Close</button>
                    </Modal.Footer>
                </Modal>                
            </div>
        );
    }
}

export default BookViewListDesktop;