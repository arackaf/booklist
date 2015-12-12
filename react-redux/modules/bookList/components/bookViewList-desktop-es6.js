const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const { toggleSelectBook, editSubject, updateSubject } = require('../actions/actionCreators');
const Modal = ReactBootstrap.Modal;
const HierarchicalSubjectList = require('./hierarchicalSubjectList');
const editSubjectStateCollection = Symbol('editSubjectStateCollection');

class BookViewListDesktop extends React.Component{
    constructor(){
        super();
        this.state = { booksSubjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [],
                       editingSubject: null, editSubjectsModalShown: false, newSubjectParent: '', newSubjectName: '' };
    }
    closeEditBooksSubjectsModal(){
        this.setState({ booksSubjectsModalShown: false });
    }
    closeEditSubjectsModal(){
        this.setState({ editSubjectsModalShown: false });
    }
    singleSelectBook(book){
        this.setState({ booksSubjectsModalShown: true, editSubjectsFor: [book], editSubjectsFor: [], subjectsAdding: [] });
    }
    multiBookSubjectsModal(){
        this.setState({ booksSubjectsModalShown: true, editSubjectsFor: this.props.bookList.filter(b => b.selected), editSubjectsFor: [], subjectsAdding: [] })
    }
    editSubjectsModal(){
        this.setState({ editSubjectsModalShown: true })
    }
    editSubject(_id){
        this.props.dispatch(editSubject(_id));
    }
    toggleAddSubjectPending(subject, toggledOn){
        this[editSubjectStateCollection](subject, toggledOn, 'subjectsAdding');
    }
    toggleRemoveSubjectPending(subject, toggledOn){
        this[editSubjectStateCollection](subject, toggledOn, 'subjectsRemoving');
    }
    [editSubjectStateCollection](subject, toggledOn, stateName){
        let updated = this.state[stateName].concat();
        if (toggledOn){
            updated.push(subject);
        } else {
            updated = updated.filter(s => s._id !== subject._id);
        }
        this.setState({ [stateName]: updated });
    }
    toggleBook(book){
        this.props.dispatch(toggleSelectBook(book._id));
    }
    updateSubject(){
        this.props.dispatch(updateSubject(this.props.editingSubject._id, this.state.newSubjectName, this.state.newSubjectParent));
    }
    render(){
        return (
            <div>
                { this.props.selectedCount ? <BootstrapButton preset="primary-sm" onClick={() => this.multiBookSubjectsModal()}>Set subjects</BootstrapButton> : null }
                &nbsp;&nbsp;&nbsp;
                <BootstrapButton preset="primary-sm" onClick={() => this.editSubjectsModal()}>Edit subjects</BootstrapButton>
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
                    { this.props.bookList.map((book, i) =>
                        <tr key={book._id}>
                            <td>
                                <i onClick={() => this.toggleBook(book)} className={'fa ' + (book.selected ? 'fa-check-square-o' : 'fa-square-o')} style={{ cursor: 'pointer' }}></i>
                            </td>
                            <td><img src={book.smallImage} /></td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                                { book.subjects.map(s => <li key={s._id}>{s.name}</li>) }
                                <button onClick={() => this.singleSelectBook(book)}>Open</button>
                            </td>
                            <td>{book.isbn}</td>
                            <td>{book.publicationDate}</td>
                            <td>{book.pages}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <Modal show={this.state.booksSubjectsModalShown} onHide={() => this.closeEditBooksSubjectsModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit subjects for:
                            <div>{this.state.editSubjectsFor.map(b => <h5 key={b._id}>{b.title}</h5>)}</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <b>Add</b> { this.state.subjectsAdding.map(s => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={s._id}>{s.name}</span>) }
                        </div>
                        <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                            <div className="panel-body">
                                <ul>
                                    { this.props.subjects.map(s => <li key={s._id}><input type="checkbox" onChange={e => this.toggleAddSubjectPending(s, e.target.checked)} /> {s.name}</li>) }
                                </ul>
                            </div>
                        </div>

                        <div>
                            <b>Remove</b> { this.state.subjectsRemoving.map(s => <span className="label label-danger" style={{ marginRight: 5, display: 'inline-block' }} key={s._id}>{s.name}</span>) }
                        </div>
                        <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                            <div className="panel-body">
                                <ul>
                                    { this.props.subjects.map(s => <li key={s._id}><input type="checkbox" onChange={e => this.toggleRemoveSubjectPending(s, e.target.checked)} /> {s.name}</li>) }
                                </ul>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={() => this.closeEditBooksSubjectsModal()}>Close</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.editSubjectsModalShown} onHide={() => this.closeEditSubjectsModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit subjects
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <HierarchicalSubjectList subjects={this.props.subjects} onEdit={_id => this.editSubject(_id)} />

                        { this.props.editingSubject ?
                            <div>
                                New name: <input onChange={(e) => this.setState({ newSubjectName: e.target.value })} value={this.state.newSubjectName} />
                                New Parent:
                                <select value={this.state.newSubjectParent} onChange={(e) => this.setState({ newSubjectParent: e.target.value })}>
                                    <option value="">None</option>
                                    { this.props.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                </select>
                                <BootstrapButton onClick={() => this.updateSubject()}>Save</BootstrapButton>
                            </div>
                            : null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={() => this.closeEditSubjectsModal()}>Close</button>
                    </Modal.Footer>
                </Modal>                
            </div>
        );
    }
}

module.exports = BookViewListDesktop;