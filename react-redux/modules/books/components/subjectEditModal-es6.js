import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import BootstrapButton, { AjaxButton, AjaxButtonAnchor } from 'applicationRoot/components/bootstrapButton';
import * as actionCreators from '../reducers/subjects/actionCreators';
import CustomColorPicker from 'applicationRoot/components/customColorPicker';
import { subjectsSelector } from '../reducers/subjects/reducer';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect'

const SubjectEditDeleteInfo = props => {
    let deleteWarning = `${props.subjectName} has ${props.affectedChildren} ${props.affectedChildren > 1 ? 'descendant subjects' : 'child subject'} which will also be deleted.`;

    return (
        <div className="row">
            <div className="col-xs-12">
                <h4>Delete subject { props.subjectName }</h4>

                { props.affectedChildren ?
                    <div className="alter alter-warning">
                        {deleteWarning}
                    </div> : null
                }

                <div style={{ marginTop: '5px'}}>
                    <BootstrapButton onClick={props.cancelDeleteSubject} preset="default-sm">Cancel</BootstrapButton>
                    <AjaxButton running={props.deleting} runningText="Deleting" onClick={() => props.deleteSubject(props._id)} preset="danger-sm" className="pull-right">Delete</AjaxButton>
                </div>
                <hr />
            </div>
        </div>
    );
}

const subjectEditModal = props => {
    let editingSubject = props.editingSubject,
        eligibleParents = props.eligibleParents;

    let textColors = ['#ffffff', '#000000'];

    return (
        <Modal show={props.editModalOpen} onHide={props.stopEditingSubjects}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit subjects
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ paddingBottom: 0 }}>
                <div className="row">
                    <div className="col-xs-11">
                        <GenericLabelSelect
                            inputProps={{ placeholder: 'Edit tag', value: props.subjectSearch, onChange: props.setSubjectSearchValue }}
                            //inputProps={{ placeholder: 'Adding', value: this.props.addingTagSearch, onChange: this.props.addingSearchValueChange }}
                            suggestions={props.subjectsSearched}
                            onSuggestionSelected={item => props.editSubject(item._id)} />

                    </div>
                    <div className="col-xs-1">
                        <BootstrapButton onClick={props.newSubject} preset="info-xs"><i className="fa fa-fw fa-plus-square"></i></BootstrapButton>
                    </div>
                </div>

                <br />

                { editingSubject ?
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            { editingSubject ? `Edit ${editingSubject.name}` : 'New Subject' }
                            { editingSubject && editingSubject._id ? <BootstrapButton onClick={e => props.beginDeleteSubject(editingSubject._id)} preset="danger-xs" className="pull-right"><i className="fa fa-fw fa-trash"></i></BootstrapButton> : null }
                        </div>
                        <div className="panel-body">
                            <div>
                                { props.deletingSubjectId ?
                                <SubjectEditDeleteInfo
                                    { ...props.deleteInfo }
                                    deleting={props.deleting}
                                    cancelDeleteSubject={props.cancelDeleteSubject}
                                    deleteSubject={props.deleteSubject} /> : null }
                                <div className="row">
                                    <div className="col-xs-6">
                                        <div className="form-group">
                                            <label>Subject name</label>
                                            <input className="form-control" value={editingSubject.name} onChange={(e) => props.setNewSubjectName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-xs-6">
                                        <div className="form-group">
                                            <label>Parent</label>
                                            <select className="form-control" value={editingSubject.parentId} onChange={(e) => props.setNewSubjectParent(e.target.value)}>
                                                <option value="">None</option>
                                                { eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-xs-9">
                                        <div className="form-group">
                                            <label>Label color</label>
                                            <div>
                                                { props.colors.map(cp => <div className="color-choice" onClick={() => props.setNewSubjectBackgroundColor(cp.backgroundColor) } style={{ backgroundColor: cp.backgroundColor }}></div>) }

                                                <CustomColorPicker labelStyle={{ marginLeft: '5px', marginTop: '3px', display: 'inline-block' }} onColorChosen={props.setNewSubjectBackgroundColor} currentColor={editingSubject.backgroundColor} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-3">
                                        <div className="form-group">
                                            <label>Text color</label>
                                            <div>
                                                { textColors.map(tc => <div className="color-choice" onClick={() => props.setNewSubjectTextColor(tc) } style={{ backgroundColor: tc }}></div>) }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <div style={{ marginTop: '10px' }} className="form-group">
                                            <label>Preview &nbsp;&nbsp;</label>
                                            <div className="label label-default" style={{ backgroundColor: editingSubject.backgroundColor, color: editingSubject.textColor }}>{ editingSubject.name }</div>
                                        </div>
                                    </div>
                                </div>
                                <br style={{ clear: 'both' }} />

                                <a className="btn btn-default" onClick={props.cancelSubjectEdit}>Cancel</a>
                                <AjaxButtonAnchor className="btn btn-primary pull-right" running={props.saving} onClick={props.createOrUpdateSubject}>Save</AjaxButtonAnchor>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </Modal.Body>
            <Modal.Footer>
                <BootstrapButton onClick={props.stopEditingSubjects}>Close</BootstrapButton>
            </Modal.Footer>
        </Modal>
    );
}

const subjectEditModalConnected = connect(subjectsSelector, { ...actionCreators })(subjectEditModal);

export default subjectEditModalConnected;