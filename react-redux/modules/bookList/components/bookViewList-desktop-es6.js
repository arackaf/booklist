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
        return (
            <div>
                <BookFilters allSubjects={this.props.subjects.list}></BookFilters>
                <br />

                { this.props.books.list.length ?
                <div>
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
                        { this.props.books.list.map(book =>
                            <tr key={book._id}>
                                <td>
                                    <i onClick={() => this.props.toggleSelectBook(book._id)} className={'fa ' + (this.props.books.selectedBooks[book._id] ? 'fa-check-square-o' : 'fa-square-o')} style={{ cursor: 'pointer' }}></i>
                                </td>
                                <td><img src={book.smallImage} /></td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>
                                    { book.subjectObjects.map(s => <div><span className="label label-default" key={s._id}>{s.name}</span></div>) }
                                    <div style={{ marginTop: 5 }}>
                                        <button className="btn btn-default btn-xs" onClick={() => this.props.enableSubjectModificationSingleBook(book._id)}>Modify</button>
                                    </div>
                                </td>
                                <td>{book.isbn}</td>
                                <td>{book.publicationDate}</td>
                                <td>{book.pages}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                :
                <div className="alert alert-warning">
                    No books found
                </div>
                }
                <BookSubjectSetterDesktop subjects={this.props.subjects}></BookSubjectSetterDesktop>

                <Modal show={!!this.props.subjects.editSubjectsPacket} onHide={this.props.stopEditingSubjects}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit subjects
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <HierarchicalSubjectList subjects={this.props.subjects.list} onEdit={_id => this.props.editSubject(_id)} />

                        { this.props.subjects.editSubjectsPacket && this.props.subjects.editSubjectsPacket.editingSubject ?
                            <div>
                                { this.props.subjects.editSubjectsPacket.editingSubject._id ? `Edit subject ${this.props.subjects.editSubjectsPacket.editingSubject.name}` : 'New Subject' }
                                <br/>
                                New name: <input value={this.props.subjects.editSubjectsPacket.newSubjectName} onChange={(e) => this.props.setNewSubjectName(e.target.value)} />
                                New Parent:
                                <select value={this.props.subjects.editSubjectsPacket.newSubjectParent} onChange={(e) => this.props.setNewSubjectParent(e.target.value)}>
                                    <option value="">None</option>
                                    { this.props.subjects.editSubjectsPacket.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                </select>
                                <BootstrapButton onClick={this.props.updateSubject}>Save</BootstrapButton>
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