import React from 'react';
import { connect } from 'react-redux';
import BootstrapButton, { AjaxButton } from 'applicationRoot/components/bootstrapButton';
import { booksSubjectsModifierSelector } from '../reducers/booksSubjectModification/reducer';
import * as bookSubjectModificationActionCreators from '../reducers/booksSubjectModification/actionCreators';

import { Modal } from 'simple-react-bootstrap';
import { Tabs, Tab } from 'react-bootstrap';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect'

class BookSubjectSetterDesktopUnConnected extends React.Component {
    setBooksSubjects(){
        this.props.setBooksSubjects(
            this.props.modifyingBooks.map(b => b._id),
            this.props.addingSubjects.map(s => s._id),
            this.props.removingSubjects.map(s => s._id));
    }
    render(){
        let subjectSelectedToAdd = this.props.addingSubjectSet.bind(null, true),
            subjectSelectedToRemove = this.props.removingSubjectSet.bind(null, true);

        let dontAddSubject = this.props.addingSubjectSet.bind(null, false),
            dontRemoveSubject = this.props.removingSubjectSet.bind(null, false);

        return (
            <Modal className="fade" show={!!this.props.modifyingBooks.length} onHide={this.props.cancelBookSubjectModification}>
                <Modal.Header closeButton>
                    <button type="button" className="close" onClick={this.props.cancelBookSubjectModification} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Edit subjects:</h4>
                </Modal.Header>
                <Modal.Body>

                    <Tabs animation={false} defaultActiveKey={1}>
                        <Tab eventKey={1} title="Choose subjects" style={{ minHeight: '150px' }}>
                            <br />
                            <div style={{ position: 'relative' }} className="row">
                                <div className="col-xs-3">
                                    <GenericLabelSelect
                                        inputProps={{ placeholder: 'Adding', value: this.props.addingSubjectSearch, onChange: this.props.addingSearchValueChange }}
                                        suggestions={this.props.eligibleToAdd}
                                        onSuggestionSelected={subjectSelectedToAdd} />
                                </div>
                                <div className="col-xs-9">
                                    <div>
                                        { this.props.addingSubjects.map(s =>
                                            <span style={{ color: s.textColor || 'white', backgroundColor: s.backgroundColor, display: 'inline-table' }} className="label label-default margin-left">
                                                <a onClick={() => dontAddSubject(s)} style={{ color: s.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{s.name}
                                            </span>) }
                                    </div>
                                </div>
                            </div>

                            <br />

                            <div style={{ position: 'relative' }} className="row">
                                <div className="col-xs-3">
                                    <GenericLabelSelect
                                        inputProps={{ placeholder: 'Removing', value: this.props.removingSubjectSearch, onChange: this.props.removingSearchValueChange }}
                                        suggestions={this.props.eligibleToRemove}
                                        onSuggestionSelected={subjectSelectedToRemove} />
                                </div>
                                <div className="col-xs-9">
                                    <div>
                                        { this.props.removingSubjects.map(s =>
                                            <span style={{ color: s.textColor || 'white', backgroundColor: s.backgroundColor, display: 'inline-table' }} className="label label-default margin-left">
                                                <a onClick={() => dontRemoveSubject(s)} style={{ color: s.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{s.name}
                                            </span>) }
                                    </div>
                                </div>
                            </div>

                            <br />
                            <BootstrapButton onClick={this.props.resetSubjects} className="pull-right" preset="default-xs">Reset subjects</BootstrapButton>
                            <br style={{ clear: 'both' }} />

                        </Tab>
                        <Tab eventKey={2} title="For books" style={{ minHeight: '150px' }}>
                            <br />
                            <ul className="list-unstyled" style={{ marginLeft: '10px' }}>
                                { this.props.modifyingBooks.map(book => <li key={book._id}>{book.title}</li>) }
                            </ul>
                            <br />
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton preset="primary" running={this.props.settingBooksSubjects} runningText='Setting' onClick={() => this.setBooksSubjects()}>Set</AjaxButton>
                    <BootstrapButton preset="" onClick={this.props.cancelBookSubjectModification}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

const BookSubjectSetterDesktop = connect(booksSubjectsModifierSelector, { ...bookSubjectModificationActionCreators })(BookSubjectSetterDesktopUnConnected);

export default BookSubjectSetterDesktop;