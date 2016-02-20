const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const Modal = ReactBootstrap.Modal;
const AjaxButton = require('/react-redux/applicationRoot/rootComponents/ajaxButton');
const { booksSubjectsModifierSelector } = require('../reducers/booksSubjectModifierReducer');

import * as bookSubjectActionCreators from '../actions/bookSubjectModify/actionCreators';

class BookSubjectSetterDesktopUnConnected extends React.Component {
    setBooksSubjects(){
        this.props.setBooksSubjects(
            this.props.modifyingBooks.map(b => b._id),
            this.props.addingSubjects.map(s => s._id),
            this.props.removingSubjects.map(s => s._id));
    }
    render(){
        return (
            <Modal show={!!this.props.modifyingBooks.length} onHide={this.props.cancelBookSubjectModification}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit subjects for:
                        <div>{ this.props.modifyingBooks.map(book => <h5 key={book._id}>{book.title}</h5>) }</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <BootstrapButton preset="primary-xs" className="pull-right" onClick={this.props.subjectModificationClearSubjects}>Reset subjects</BootstrapButton>
                    </div>
                    <div>
                        <b>Add</b> { this.props.addingSubjects.map(subject => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={subject._id}>{subject.name}</span>) }
                    </div>
                    <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                        <div className="panel-body">
                            <ul>
                                { this.props.subjects.list.map(s => <li key={s._id}><input type="checkbox" checked={!!this.props.addingSubjectIds[s._id]} onChange={() => this.props.toggleSubjectModificationAdd(s._id)}/> {s.name} </li>) }
                            </ul>
                        </div>
                    </div>

                    <div>
                        <b>Remove</b>
                        { this.props.removingSubjects.map(subject => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={subject._id}>{subject.name}</span>) }
                    </div>
                    <div className="panel panel-default" style={{ maxHeight: 150, marginTop: 5, overflow: 'scroll' }}>
                        <div className="panel-body">
                            <ul>
                                { this.props.subjects.list.map(s => <li key={s._id}><input type="checkbox" checked={!!this.props.removingSubjectIds[s._id]} onChange={() => this.props.toggleSubjectModificationRemove(s._id)}/> {s.name} </li>) }
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton preset="primary" running={this.props.settingBooksSubjects} runningText='Setting' onClick={() => this.setBooksSubjects()}>Set</AjaxButton>
                    <BootstrapButton preset="" onClick={this.props.cancelBookSubjectModification}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

const BookSubjectSetterDesktop = ReactRedux.connect(state => booksSubjectsModifierSelector(state.bookList), { ...bookSubjectActionCreators })(BookSubjectSetterDesktopUnConnected);

module.exports = BookSubjectSetterDesktop;