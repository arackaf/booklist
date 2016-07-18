import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import AjaxButton from 'applicationRoot/rootComponents/ajaxButton';
import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';
import * as actionCreators from '../../reducers/tags/actionCreators';
import CustomColorPicker from '../subject-edit/customColorPicker';
import { tagsSelector } from '../../reducers/tags/reducer';
import GenericLabelSelect from 'applicationRoot/rootComponents/GenericLabelSelect'

const TagEditDeleteInfo = props => {
    let deleteWarning = `${props.tagName} has ${props.affectedChildren} ${props.affectedChildren > 1 ? 'descendant tags' : 'child tag'} which will also be deleted.`;

    return (
        <div className="row">
            <div className="col-xs-12">
                <h4>Delete tag { props.tagName }</h4>

                { props.affectedChildren ?
                    <div className="alter alter-warning">
                        {deleteWarning}
                    </div> : null
                }

                <div style={{ marginTop: '5px'}}>
                    <BootstrapButton onClick={props.cancelDeleteTag} preset="default-sm">Cancel</BootstrapButton>
                    <AjaxButton running={props.deleting} runningText="Deleting" onClick={() => props.deleteTag(props._id)} preset="danger-sm" className="pull-right">Delete</AjaxButton>
                </div>
                <hr />
            </div>
        </div>
    );
}

const tagEditModal = props => {
    let editTagPacket = props.editTagPacket;
    let editingTag;

    if (editTagPacket && editTagPacket.editingTag){
        editingTag = editTagPacket.editingTag;
    }

    let textColors = ['#ffffff', '#000000'];

    return (
        <Modal show={!!editTagPacket} onHide={props.stopEditingTags}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit tags
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ paddingBottom: 0 }}>
                <div className="row">
                    <div className="col-xs-11">
                        <GenericLabelSelect
                            inputProps={{ placeholder: 'Edit tag', value: '', onChange: () => {} }}
                            //inputProps={{ placeholder: 'Adding', value: this.props.addingTagSearch, onChange: this.props.addingSearchValueChange }}
                            suggestions={props.allTagsSorted}
                            onSuggestionSelected={item => props.editTag(item._id)} />
                    </div>
                    <div className="col-xs-1">
                        <BootstrapButton onClick={props.newTag} preset="info-xs"><i className="fa fa-fw fa-plus-square"></i></BootstrapButton>
                    </div>
                </div>
                <br />

                { editTagPacket && editTagPacket.editing ?
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            { editingTag ? `Edit ${editingTag.name}` : 'New Tag' }
                            <BootstrapButton onClick={e => props.beginDeleteTag(editingTag._id)} preset="danger-xs" className="pull-right"><i className="fa fa-fw fa-trash"></i></BootstrapButton>
                        </div>
                        <div className="panel-body">
                            <div>
                                { editTagPacket.deleteInfo ?
                                    <TagEditDeleteInfo
                                        { ...props.editTagPacket.deleteInfo }
                                        cancelDeleteTag={props.cancelDeleteTag}
                                        deleteTag={props.deleteTag} /> : null }
                                <div className="row">
                                    <div className="col-xs-6">
                                        <div className="form-group">
                                            <label>Tag name</label>
                                            <input className="form-control" value={editTagPacket.name} onChange={(e) => props.setNewTagName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-xs-9">
                                        <div className="form-group">
                                            <label>Label color</label>
                                            <div>
                                                { props.colors.map(cp => <div className="color-choice" onClick={() => props.setNewTagBackgroundColor(cp.backgroundColor) } style={{ backgroundColor: cp.backgroundColor }}></div>) }

                                                <CustomColorPicker onColorChosen={props.setNewTagBackgroundColor} currentColor={editTagPacket.backgroundColor} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-3">
                                        <div className="form-group">
                                            <label>Text color</label>
                                            <div>
                                                { textColors.map(tc => <div className="color-choice" onClick={() => props.setNewTagTextColor(tc) } style={{ backgroundColor: tc }}></div>) }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <div style={{ marginTop: '10px' }} className="form-group">
                                            <label>Preview &nbsp;&nbsp;</label>
                                            <div className="label label-default" style={{ backgroundColor: editTagPacket.backgroundColor, color: editTagPacket.textColor }}>{ editTagPacket.name }</div>
                                        </div>
                                    </div>
                                </div>
                                <br style={{ clear: 'both' }} />

                                <a className="btn btn-default" onClick={props.cancelTagEdit}>Cancel</a>
                                <a className="btn btn-primary pull-right" onClick={e => { props.createOrUpdateTag(); e.preventDefault();} }>Save</a>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </Modal.Body>
            <Modal.Footer>
                <BootstrapButton onClick={props.stopEditingTags}>Close</BootstrapButton>
            </Modal.Footer>
        </Modal>
    );
}

const tagEditModalConnected = connect(tagsSelector, { ...actionCreators })(tagEditModal);

export default tagEditModalConnected;