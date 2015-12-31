const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const { toggleSelectBook, editSubjects, stopEditingSubjects, setNewSubjectName, setNewSubjectParent, editSubject, updateSubject } = require('../actions/actionCreators');
const Modal = ReactBootstrap.Modal;
const HierarchicalSubjectList = require('./hierarchicalSubjectList');
const HierarchicalSelectableSubjectList = require('./hierarchicalSelectableSubjectList');
const BookSearchDesktop = require('./BookSearch-desktop');

class BookViewListDesktop extends React.Component{
    constructor(){
        super();
        this.state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [], editingSubject: null };
    }
    render(){
        return (
            <div>
                <BookSearchDesktop openSubjectsFilterModal={this.props.openSubjectsFilterModal} closeSubjectsFilterModal={this.props.openSubjectsFilterModal}></BookSearchDesktop>
                <br />
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
                                { book.subjectObjects.map(s => <li key={s._id}>{s.name}</li>) }
                                <button onClick={() => this.props.enableSubjectModificationSingleBook(book._id)}>Open</button>
                            </td>
                            <td>{book.isbn}</td>
                            <td>{book.publicationDate}</td>
                            <td>{book.pages}</td>
                        </tr>
                    )}
                    </tbody>
                </table>


                <Modal show={!!this.props.filters.subjectsFilterModal} onHide={this.props.closeSubjectsFilterModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Filter subjects
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.filters.subjectsFilterModal
                            ? <HierarchicalSelectableSubjectList
                                subjectsFilterModal={this.props.filters.subjectsFilterModal}
                                toggleFilteredSubject={this.props.toggleFilteredSubject}
                                subjects={this.props.subjects.list}/>
                            : null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.props.closeSubjectsFilterModal}>Close</button>
                    </Modal.Footer>
                </Modal>


                <Modal show={!!this.props.booksSubjectsModifier.modifyingBooks.length} onHide={this.props.cancelSubjectModification}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit subjects for:
                            <div>{ this.props.booksSubjectsModifier.modifyingBooks.map(book => <h5 key={book._id}>{book.title}</h5>) }</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <b>Add</b> { this.props.booksSubjectsModifier.addingSubjects.map(subject => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={subject._id}>{subject.name}</span>) }
                        </div>
                        <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                            <div className="panel-body">
                                <ul>
                                    { this.props.subjects.list.map(s => <li key={s._id}><input type="checkbox" checked={!!this.props.booksSubjectsModifier.addingSubjectIds[s._id]} onChange={() => this.props.toggleSubjectModificationAdd(s._id)}/> {s.name} </li>) }
                                </ul>
                            </div>
                        </div>

                        <div>
                            <b>Remove</b>
                            { this.props.booksSubjectsModifier.removingSubjects.map(subject => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={subject._id}>{subject.name}</span>) }
                        </div>
                        <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                            <div className="panel-body">
                                <ul>
                                    { this.props.subjects.list.map(s => <li key={s._id}><input type="checkbox" checked={!!this.props.booksSubjectsModifier.removingSubjectIds[s._id]} onChange={() => this.props.toggleSubjectModificationRemove(s._id)}/> {s.name} </li>) }
                                </ul>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={this.props.cancelSubjectModification}>Cancel</button>
                    </Modal.Footer>
                </Modal>

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

module.exports = BookViewListDesktop;