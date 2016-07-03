import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';
import * as actionCreators from '../../reducers/subjects/actionCreators';
import HierarchicalSubjectList from './hierarchicalSubjectList';
import CustomColorPicker from './customColorPicker';

class subjectEditModal extends React.Component {
    render(){
        let editSubjectsPacket = this.props.editSubjectsPacket;
        let editingSubject;

        if (editSubjectsPacket && editSubjectsPacket.editingSubject){
            editingSubject = editSubjectsPacket.editingSubject;
        }

        let textColors = ['#ffffff', '#000000'];

        return (
            <Modal show={!!editSubjectsPacket} onHide={this.props.stopEditingSubjects}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit subjects
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ paddingBottom: 0 }}>
                    <div className="row">
                        <div className="col-xs-11">
                            <HierarchicalSubjectList style={{ paddingLeft: 5 }} subjects={this.props.subjects} onEdit={_id => this.props.editSubject(_id)} />
                        </div>
                        <div className="col-xs-1">
                            <BootstrapButton onClick={this.props.newSubject} preset="info-xs"><i className="fa fa-fw fa-plus-square"></i></BootstrapButton>
                        </div>
                    </div>

                    { editSubjectsPacket && editSubjectsPacket.editing ?
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                { editingSubject ? `Edit ${editingSubject.name}` : 'New Subject' }
                                <BootstrapButton onClick={e => this.props.beginDeleteSubject(editingSubject._id)} preset="danger-xs" className="pull-right"><i className="fa fa-fw fa-trash"></i></BootstrapButton>
                            </div>
                            <div className="panel-body">
                                <form>
                                    <div className="row">
                                        <div className="col-xs-6">
                                            <div className="form-group">
                                                <label>Subject name</label>
                                                <input className="form-control" value={editSubjectsPacket.name} onChange={(e) => this.props.setNewSubjectName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-xs-6">
                                            <div className="form-group">
                                                <label>Parent</label>
                                                <select className="form-control" value={editSubjectsPacket.parentId} onChange={(e) => this.props.setNewSubjectParent(e.target.value)}>
                                                    <option value="">None</option>
                                                    { editSubjectsPacket.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-xs-9">
                                            <div className="form-group">
                                                <label>Label color</label>
                                                <div>
                                                    { this.props.colors.map(cp => <div className="color-choice" onClick={() => this.props.setNewSubjectBackgroundColor(cp.backgroundColor) } style={{ backgroundColor: cp.backgroundColor }}></div>) }

                                                    <CustomColorPicker onColorChosen={this.props.setNewSubjectBackgroundColor} initialColor="FF20FF" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-3">
                                            <div className="form-group">
                                                <label>Text color</label>
                                                <div>
                                                    { textColors.map(tc => <div className="color-choice" onClick={() => this.props.setNewSubjectTextColor(tc) } style={{ backgroundColor: tc }}></div>) }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <div style={{ marginTop: '10px' }} className="form-group">
                                                <label>Preview &nbsp;&nbsp;</label>
                                                <div className="label label-default" style={{ backgroundColor: editSubjectsPacket.backgroundColor, color: editSubjectsPacket.textColor }}>{ editSubjectsPacket.name }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <br style={{ clear: 'both' }} />

                                    <a className="btn btn-default" onClick={this.props.cancelSubjectEdit}>Cancel</a>
                                    <a className="btn btn-primary pull-right" onClick={e => { this.props.createOrUpdateSubject(); e.preventDefault();} }>Save</a>
                                </form>
                            </div>
                        </div>
                        : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <BootstrapButton onClick={this.props.stopEditingSubjects}>Close</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

const subjectEditModalConnected = connect(state => state, { ...actionCreators })(subjectEditModal);

export default subjectEditModalConnected;