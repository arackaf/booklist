import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Modal } from 'simple-react-bootstrap';

import BootstrapButton, { AjaxButton, AjaxButtonAnchor } from 'applicationRoot/components/bootstrapButton';
import * as actionCreators from '../reducers/subjects/actionCreators';
import CustomColorPicker from 'applicationRoot/components/customColorPicker';
import { selectEntireSubjectsState, entireSubjectsStateType } from '../reducers/subjects/reducer';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect';
import ColorsPalette from 'applicationRoot/components/colorsPalette';

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
                    <AjaxButton running={props.deleting} runningText="Deleting" onClick={() => props.deleteSubject(props._id)} preset="danger-sm">Delete</AjaxButton>
                    <BootstrapButton onClick={props.cancelDeleteSubject} className="pull-right" preset="default-sm">Cancel</BootstrapButton>
                </div>
                <hr />
            </div>
        </div>
    );
}

@connect(selectEntireSubjectsState, { ...actionCreators })
export default class SubjectEditModal extends Component<entireSubjectsStateType & typeof actionCreators, any>{
    render(){ 
        let props = this.props,
            editingSubject = props.editingSubject,
            eligibleParents = props.eligibleParents,
            textColors = ['#ffffff', '#000000'];

        return (
            <Modal className="fade" show={props.editModalOpen} onHide={props.stopEditingSubjects}>
                <Modal.Header>
                    <button type="button" className="close" onClick={props.stopEditingSubjects} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Full search</h4>
                </Modal.Header>
                <Modal.Body style={{ paddingBottom: 0 }}>
                    <div className="visible-xs">
                        <BootstrapButton onClick={props.newSubject} preset="info-xs">Add new subject <i className="fa fa-fw fa-plus"></i></BootstrapButton>
                        <br />
                        <br />
                    </div>
                    <div className="row">
                        <div className="col-xs-11">
                            <GenericLabelSelect
                                inputProps={{ placeholder: 'Edit subject', value: props.subjectSearch, onChange: props.setSubjectSearchValue }}
                                suggestions={props.subjectsSearched}
                                onSuggestionSelected={item => props.editSubject(item._id)} />

                        </div>
                        <div className="col-xs-1" style={{ padding: 0 }}>
                            <BootstrapButton className="hidden-xs" onClick={props.newSubject} preset="info-xs"><i className="fa fa-fw fa-plus-square"></i></BootstrapButton>
                        </div>
                    </div>

                    <br />

                    { editingSubject ?
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                { editingSubject && editingSubject._id ? `Edit ${editingSubject.name}` : 'New Subject' }
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
                                                <input className="form-control" value={editingSubject.name} onChange={(e: any) => props.setNewSubjectName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-xs-6">
                                            <div className="form-group">
                                                <label>Parent</label>
                                                <select className="form-control" value={editingSubject.parentId} onChange={(e: any) => props.setNewSubjectParent(e.target.value)}>
                                                    <option value="">None</option>
                                                    { eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-xs-9">
                                            <div className="form-group">
                                                <label>Label color</label>

                                                <ColorsPalette currentColor={editingSubject.backgroundColor} colors={props.colors} onColorChosen={props.setNewSubjectBackgroundColor} />
                                                <CustomColorPicker labelStyle={{ marginLeft: '5px', marginTop: '3px', display: 'inline-block' }} onColorChosen={props.setNewSubjectBackgroundColor} currentColor={editingSubject.backgroundColor} />
                                            </div>
                                        </div>
                                        <div className="col-xs-3">
                                            <div className="form-group">
                                                <label>Text color</label>

                                                <ColorsPalette colors={textColors} onColorChosen={props.setNewSubjectTextColor} />
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

                                    <AjaxButtonAnchor className="btn btn-primary" running={props.saving} onClick={props.createOrUpdateSubject}>Save</AjaxButtonAnchor>
                                    <a className="btn btn-default pull-right" onClick={props.cancelSubjectEdit}>Cancel</a>
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
}