const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const { toggleSelectBook } = require('../actions/actionCreators');
const Modal = ReactBootstrap.Modal;

const editSubjectStateCollection = Symbol('editSubjectStateCollection');
class BookViewListDesktop extends React.Component{
    constructor(){
        super();
        this.state = { subjectsModalShown: false, editSubjectsFor: [], subjectsAdding: [], subjectsRemoving: [] };
    }
    closeModal(){
        this.setState({ subjectsModalShown: false });
    }
    singleSelectBook(book){
        this.setState({ subjectsModalShown: true, editSubjectsFor: [book] });
    }
    multiBookSubjectsModal(){
        this.setState({ subjectsModalShown: true, editSubjectsFor: this.props.bookList.filter(b => b.selected) })
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
    render(){
        return (
            <div>
                { this.props.selectedCount ? <BootstrapButton preset="primary-sm" onClick={() => this.multiBookSubjectsModal()}>Set subjects</BootstrapButton> : null }
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th></th>
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
                        <tr key={'bookDesktop' + i}>
                            <td>
                                <BootstrapButton preset='primary-xs' onClick={() => this.toggleBook(book)}><i className={'fa ' + (book.selected ? 'fa-check-square-o' : 'fa-square-o')}></i></BootstrapButton>
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
                <Modal show={this.state.subjectsModalShown} onHide={() => this.closeModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit subjects for:
                            <div>{this.state.editSubjectsFor.map(b => <h5 key={'addForB' + b._id}>{b.title}</h5>)}</div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <b>Add</b> { this.state.subjectsAdding.map(s => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={'addingS' + s._id}>{s.name}</span>) }
                        </div>
                        <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                            <div className="panel-body">
                                <ul>
                                    { this.props.subjects.map(s => <li key={'addS' + s._id}><input type="checkbox" onChange={e => this.toggleAddSubjectPending(s, e.target.checked)} /> {s.name}</li>) }
                                </ul>
                            </div>
                        </div>

                        <div>
                            <b>Remove</b> { this.state.subjectsRemoving.map(s => <span className="label label-danger" style={{ marginRight: 5, display: 'inline-block' }} key={'removingS' + s._id}>{s.name}</span>) }
                        </div>
                        <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                            <div className="panel-body">
                                <ul>
                                    { this.props.subjects.map(s => <li key={'remS' + s._id}><input type="checkbox" onChange={e => this.toggleRemoveSubjectPending(s, e.target.checked)} /> {s.name}</li>) }
                                </ul>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={() => this.closeModal()}>Close</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

module.exports = BookViewListDesktop;