import React from 'react';
import { connect } from 'react-redux';
import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';
import AjaxButton from 'applicationRoot/rootComponents/ajaxButton';
import { booksSubjectsModifierSelector } from '../reducers/booksSubjectModification/reducer';
import * as bookSubjectModificationActionCreators from '../reducers/booksSubjectModification/actionCreators';

import { Modal, Tabs, Tab } from 'react-bootstrap';
import GenericLabelSelect from 'applicationRoot/rootComponents/GenericLabelSelect'

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
            <Modal show={!!this.props.modifyingBooks.length} onHide={this.props.cancelBookSubjectModification}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit subjects for:
                        <div>{ this.props.modifyingBooks.map(book => <h5 key={book._id}>{book.title}</h5>) }</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Tabs animation={false} defaultActiveKey={1}>
                        <Tab eventKey={1} title="Choose subjects" style={{ minHeight: '150px' }}>
                            <br />
                            <div style={{ position: 'relative' }} className="row">
                                <div className="col-xs-12">
                                    <GenericLabelSelect
                                        inputProps={{ placeholder: 'Adding', value: this.props.addingSubjectSearch, onChange: this.props.addingSearchValueChange }}
                                        suggestions={this.props.eligibleToAdd}
                                        onSuggestionSelected={subjectSelectedToAdd} />

                                    <div style={{ float: 'left', display: 'inline' }}>
                                        { this.props.addingSubjects.map(s =>
                                            <span style={{ color: s.textColor || 'white', backgroundColor: s.backgroundColor }} className="label label-default margin-left">
                                        <a onClick={() => dontAddSubject(s)} style={{ color: s.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{s.name}
                                    </span>) }
                                    </div>
                                </div>
                            </div>

                            <br />

                            <div style={{ position: 'relative' }} className="row">
                                <div className="col-xs-12">
                                    <GenericLabelSelect
                                        inputProps={{ placeholder: 'Removing', value: this.props.removingSubjectSearch, onChange: this.props.removingSearchValueChange }}
                                        suggestions={this.props.eligibleToRemove}
                                        onSuggestionSelected={subjectSelectedToRemove} />

                                    <div style={{ float: 'left', display: 'inline' }}>
                                        { this.props.removingSubjects.map(s =>
                                            <span style={{ color: s.textColor || 'white', backgroundColor: s.backgroundColor }} className="label label-default margin-left">
                                        <a onClick={() => dontRemoveSubject(s)} style={{ color: s.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{s.name}
                                    </span>) }
                                    </div>
                                </div>
                            </div>

                        </Tab>
                        <Tab eventKey={2} title="For books" style={{ minHeight: '150px' }}>
                            <br />
                            Hello world
                        </Tab>
                    </Tabs>

                    <br />

                    <BootstrapButton onClick={this.props.resetSubjects} className="pull-right" preset="default-xs">Reset subjects</BootstrapButton>
                    <br />
                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton preset="primary" running={this.props.settingBooksSubjects} runningText='Setting' onClick={() => this.setBooksSubjects()}>Set</AjaxButton>
                    <BootstrapButton preset="" onClick={this.props.cancelBookSubjectModification}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );

        /*
         <div>
         <b>Add</b> { this.props.addingSubjects.map(subject => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={subject._id}>{subject.name}</span>) }
         </div>
         <div className="panel panel-default" style={{ maxHeight: 150, overflow: 'scroll' }}>
         <div className="panel-body" style={{ paddingTop: 0 }}>
         { this.props.allSubjectsSorted.map(s =>
         <div className="checkbox" key={s._id}>
         <label><input type="checkbox" checked={!!this.props.addingSubjectIds[s._id]} onChange={() => this.props.toggleSubjectModificationAdd(s._id)}/> {s.name}</label>
         </div>)
         }
         </div>
         </div>

         <div>
         <b>Remove</b> { this.props.removingSubjects.map(subject => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={subject._id}>{subject.name}</span>) }
         </div>
         <div className="panel panel-default" style={{ maxHeight: 150, overflow: 'scroll' }}>
         <div className="panel-body" style={{ paddingTop: 0 }}>
         { this.props.allSubjectsSorted.map(s =>
         <div className="checkbox" key={s._id}>
         <label><input type="checkbox" checked={!!this.props.removingSubjectIds[s._id]} onChange={() => this.props.toggleSubjectModificationRemove(s._id)}/> {s.name}</label>
         </div>)
         }
         </div>
         </div>
         */
    }
}

const BookSubjectSetterDesktop = connect(booksSubjectsModifierSelector, { ...bookSubjectModificationActionCreators })(BookSubjectSetterDesktopUnConnected);

export default BookSubjectSetterDesktop;