import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import AjaxButton from 'applicationRoot/rootComponents/ajaxButton';
import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';
import * as actionCreators from '../../reducers/subjects/actionCreators';
import HierarchicalSubjectList from './hierarchicalSubjectList';
import CustomColorPicker from './customColorPicker';
import { subjectsSelector } from '../../reducers/subjects/reducer';

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
    let editSubjectPacket = props.editSubjectPacket;
    let editingSubject;

    if (editSubjectPacket && editSubjectPacket.editingSubject){
        editingSubject = editSubjectPacket.editingSubject;
    }

    let textColors = ['#ffffff', '#000000'];

    return (
        <Modal show={!!editSubjectPacket} onHide={props.stopEditingSubjects}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit subjects
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ paddingBottom: 0 }}>
                <div className="row">
                    <div className="col-xs-11">
                        <HierarchicalSubjectList style={{ paddingLeft: 5 }} subjects={props.subjects} onEdit={_id => props.editSubject(_id)} />
                    </div>
                    <div className="col-xs-1">
                        <BootstrapButton onClick={props.newSubject} preset="info-xs"><i className="fa fa-fw fa-plus-square"></i></BootstrapButton>
                    </div>
                </div>

                { editSubjectPacket && editSubjectPacket.editing ?
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            { editingSubject ? `Edit ${editingSubject.name}` : 'New Subject' }
                            <BootstrapButton onClick={e => props.beginDeleteSubject(editingSubject._id)} preset="danger-xs" className="pull-right"><i className="fa fa-fw fa-trash"></i></BootstrapButton>
                        </div>
                        <div className="panel-body">
                            <div>
                                { editSubjectPacket.deleteInfo ?
                                    <SubjectEditDeleteInfo
                                        { ...props.editSubjectPacket.deleteInfo }
                                        cancelDeleteSubject={props.cancelDeleteSubject}
                                        deleteSubject={props.deleteSubject} /> : null }
                                <div className="row">
                                    <div className="col-xs-6">
                                        <div className="form-group">
                                            <label>Subject name</label>
                                            <input className="form-control" value={editSubjectPacket.name} onChange={(e) => props.setNewSubjectName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-xs-6">
                                        <div className="form-group">
                                            <label>Parent</label>
                                            <select className="form-control" value={editSubjectPacket.parentId} onChange={(e) => props.setNewSubjectParent(e.target.value)}>
                                                <option value="">None</option>
                                                { editSubjectPacket.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-xs-9">
                                        <div className="form-group">
                                            <label>Label color</label>
                                            <div>
                                                { props.colors.map(cp => <div className="color-choice" onClick={() => props.setNewSubjectBackgroundColor(cp.backgroundColor) } style={{ backgroundColor: cp.backgroundColor }}></div>) }

                                                <CustomColorPicker onColorChosen={props.setNewSubjectBackgroundColor} initialColor="FF20FF" />
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
                                            <div className="label label-default" style={{ backgroundColor: editSubjectPacket.backgroundColor, color: editSubjectPacket.textColor }}>{ editSubjectPacket.name }</div>
                                        </div>
                                    </div>
                                </div>
                                <br style={{ clear: 'both' }} />

                                <a className="btn btn-default" onClick={props.cancelSubjectEdit}>Cancel</a>
                                <a className="btn btn-primary pull-right" onClick={e => { props.createOrUpdateSubject(); e.preventDefault();} }>Save</a>
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

const subjectEditModalConnected = connect(state => subjectsSelector(state.books), { ...actionCreators })(subjectEditModal);

export default subjectEditModalConnected;