import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Modal} from 'simple-react-bootstrap';
const {createSelector} = require('reselect');
import BootstrapButton, { AjaxButton, AjaxButtonAnchor } from 'applicationRoot/components/bootstrapButton';
import * as actionCreators from '../reducers/subjects/actionCreators';
import CustomColorPicker from 'applicationRoot/components/customColorPicker';
import { selectEntireSubjectsState, entireSubjectsStateType, filterSubjects } from '../reducers/subjects/reducer';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect';
import ColorsPalette from 'applicationRoot/components/colorsPalette';
import {computeSubjectParentId, getEligibleParents} from 'applicationRoot/rootReducer';

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

interface ILocalProps {
    editModalOpen: boolean;
    stopEditing: any
}

@connect(selectEntireSubjectsState, { ...actionCreators })
export default class SubjectEditModal extends Component<entireSubjectsStateType & ILocalProps & typeof actionCreators, any>{
    currentEligibleParents: any;
    constructor(props) {
        super(props);

        this.currentEligibleParents = createSelector(
            state => state.subjectHash,
            state => state.editingSubject,
            (hash, subject) => {
                return subject && subject._id ? getEligibleParents(hash, subject._id) : []
            }
        )
    }

    state = {
        editingSubject: null,
        editingSubjectName: '',
        subjectSearch: '',
        deletingId: '',
        saving: false,
        deleting: false
    }

    setSubjectSearch = value => this.setState({subjectSearch: value});

    newSubject = () => this.startEditing({ _id: '', name: '', backgroundColor: '', textColor: '' });
    editSubject = subject => {
        this.startEditing(subject);
        this.setSubjectSearch('');
    }
    startEditing = subject => this.setState({editingSubject: subject, editingSubjectName: subject.name});
    cancelSubjectEdit = () => this.setState({editingSubject: null});

    setNewSubjectName = value => this.setEditingValue('name', value);
    setNewSubjectParent = value => this.setEditingValue('parentId', value);
    setNewSubjectBackgroundColor = value => this.setEditingValue('backgroundColor', value);
    setNewSubjectTextColor = value => this.setEditingValue('textColor', value);
    setEditingValue = (name, value) => this.setState(({editingSubject}) => ({ editingSubject: {...editingSubject, [name]: value} }));

    createOrUpdateTag = () => {
        this.setState({saving: true});
        Promise
            .resolve(this.props.createOrUpdateSubject(this.state.editingSubject))
            .then(() => {
                this.cancelSubjectEdit();
                this.setSubjectSearch('');
                this.setState({saving: false});
            })
    }
    deleteTag = () => {
        this.setState({deleting: true});
        Promise
            .resolve(this.props.deleteSubject(this.state.editingSubject._id))
            .then(() => {
                this.setState({deleting: false})
                this.cancelSubjectEdit();
            });
    }

    render(){
        let props = this.props,
            {editingSubject, subjectSearch, deletingId, deleting, saving} = this.state,
            eligibleParents = this.currentEligibleParents({subjectHash: props.subjectHash, editingSubject}),
            textColors = ['#ffffff', '#000000'],
            searchedSubjects = filterSubjects(props.allSubjectsSorted, this.state.subjectSearch);

        return (
            <Modal className="fade" show={props.editModalOpen} onHide={props.stopEditing}>
                <Modal.Header>
                    <button type="button" className="close" onClick={props.stopEditing} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Edit Subjects</h4>
                </Modal.Header>
                <Modal.Body style={{ paddingBottom: 0 }}>
                    <div className="visible-xs">
                        <BootstrapButton onClick={this.newSubject} preset="info-xs">Add new subject <i className="fa fa-fw fa-plus"></i></BootstrapButton>
                        <br />
                        <br />
                    </div>
                    <div className="row">
                        <div className="col-xs-11">
                            <GenericLabelSelect
                                inputProps={{ placeholder: 'Edit subject', value: subjectSearch, onChange: evt => this.setSubjectSearch(evt.target.value) }}
                                suggestions={searchedSubjects}
                                onSuggestionSelected={item => this.editSubject(item)} />

                        </div>
                        <div className="col-xs-1" style={{ padding: 0 }}>
                            <BootstrapButton className="hidden-xs" onClick={this.newSubject} preset="info-xs"><i className="fa fa-fw fa-plus-square"></i></BootstrapButton>
                        </div>
                    </div>

                    <br />

                    {editingSubject ?
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                { editingSubject && editingSubject._id ? `Edit ${editingSubject.name}` : 'New Subject' }
                                { editingSubject && editingSubject._id ? <BootstrapButton onClick={e => this.setState({deletingId: editingSubject._id})} preset="danger-xs" className="pull-right"><i className="fa fa-fw fa-trash"></i></BootstrapButton> : null }
                            </div>
                            <div className="panel-body">
                                <div>
                                    {deletingId ?
                                        <SubjectEditDeleteInfo
                                            deleting={deleting}
                                            cancelDeleteSubject={() => this.setState({deletingId: ''})}
                                            deleteSubject={props.deleteSubject} /> : null }

                                    <div className="row">
                                        <div className="col-xs-6">
                                            <div className="form-group">
                                                <label>Subject name</label>
                                                <input className="form-control" value={editingSubject.name} onChange={(e: any) => this.setNewSubjectName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-xs-6">
                                            <div className="form-group">
                                                <label>Parent</label>
                                                <select className="form-control" value={editingSubject.parentId} onChange={(e: any) => this.setNewSubjectParent(e.target.value)}>
                                                    <option value="">None</option>
                                                    { eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>) }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-xs-9">
                                            <div className="form-group">
                                                <label>Label color</label>

                                                <ColorsPalette currentColor={editingSubject.backgroundColor} colors={props.colors} onColorChosen={this.setNewSubjectBackgroundColor} />
                                                <CustomColorPicker labelStyle={{ marginLeft: '5px', marginTop: '3px', display: 'inline-block' }} onColorChosen={this.setNewSubjectBackgroundColor} currentColor={editingSubject.backgroundColor} />
                                            </div>
                                        </div>
                                        <div className="col-xs-3">
                                            <div className="form-group">
                                                <label>Text color</label>

                                                <ColorsPalette colors={textColors} onColorChosen={this.setNewSubjectTextColor} />
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

                                    <AjaxButtonAnchor className="btn btn-primary" running={saving} onClick={props.createOrUpdateSubject}>Save</AjaxButtonAnchor>
                                    <a className="btn btn-default pull-right" onClick={this.cancelSubjectEdit}>Cancel</a>
                                </div>
                            </div>
                        </div>
                        : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <BootstrapButton onClick={props.stopEditing}>Close</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}