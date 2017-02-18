import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'simple-react-bootstrap';

import BootstrapButton, { AjaxButton } from 'applicationRoot/components/bootstrapButton';
import * as actionCreators from '../reducers/tags/actionCreators';
import CustomColorPicker from 'applicationRoot/components/customColorPicker';
import { tagsSelector } from '../reducers/tags/reducer';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect';
import ColorsPalette from 'applicationRoot/components/colorsPalette';

const TagEditDeleteInfo = props =>
    <div className="row">
        <div className="col-xs-12">
            <h4>Delete tag { props.tagName }</h4>

            <div style={{ marginTop: '5px'}}>
                <AjaxButton running={props.deleting} runningText="Deleting" onClick={() => props.deleteTag(props._id)} preset="danger-sm">Delete</AjaxButton>
                <BootstrapButton onClick={props.cancelDeleteTag} preset="default-sm" className="pull-right">Cancel</BootstrapButton>
            </div>
            <hr />
        </div>
    </div>;

const tagEditModal = props => {
    let deleteInfo = props.deleteInfo,
        editingTag = props.editingTag,
        textColors = ['#ffffff', '#000000'];

    return (
        <Modal className="fade" show={!!props.editTagOpen} onHide={props.stopEditingTags}>
            <Modal.Header closeButton>
                <button type="button" className="close" onClick={props.stopEditingTags} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Edit tags</h4>
            </Modal.Header>
            <Modal.Body style={{ paddingBottom: 0 }}>
                <div className="visible-xs">
                    <BootstrapButton onClick={props.newTag} preset="info-xs">Add new tag <i className="fa fa-fw fa-plus"></i></BootstrapButton>
                    <br />
                    <br />
                </div>
                <div className="row">
                    <div className="col-xs-11">
                        <GenericLabelSelect
                            inputProps={{ placeholder: 'Edit tag', value: props.tagSearch, onChange: props.setTagSearchValue }}
                            suggestions={props.tagsSearched}
                            onSuggestionSelected={item => props.editTag(item._id)} />
                    </div>
                    <div className="col-xs-1" style={{ padding: 0 }}>
                        <BootstrapButton className="hidden-xs" onClick={props.newTag} preset="info-xs"><i className="fa fa-fw fa-plus-square"></i></BootstrapButton>
                    </div>
                </div>
                <br />

                { editingTag ?
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            { editingTag ? `Edit ${editingTag.name}` : 'New Tag' }
                            { editingTag && editingTag._id ? <BootstrapButton onClick={e => props.beginDeleteTag(editingTag._id)} preset="danger-xs" className="pull-right"><i className="fa fa-fw fa-trash"></i></BootstrapButton> : null }
                        </div>
                        <div className="panel-body">
                            <div>
                                { deleteInfo ?
                                    <TagEditDeleteInfo
                                        {...deleteInfo}
                                        deleting={props.deleting}
                                        cancelDeleteTag={props.cancelDeleteTag}
                                        deleteTag={props.deleteTag} /> : null }
                                <div className="row">
                                    <div className="col-xs-6">
                                        <div className="form-group">
                                            <label>Tag name</label>
                                            <input className="form-control" value={editingTag.name} onChange={(e) => props.setNewTagName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-xs-9">
                                        <div className="form-group">
                                            <label>Label color</label>
                                            <div>
                                                <ColorsPalette currentColor={editingTag.backgroundColor} colors={props.colors} onColorChosen={props.setNewTagBackgroundColor} />
                                                <CustomColorPicker onColorChosen={props.setNewTagBackgroundColor} currentColor={editingTag.backgroundColor} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-3">
                                        <div className="form-group">
                                            <label>Text color</label>
                                            <div>
                                                <ColorsPalette colors={textColors} onColorChosen={props.setNewTagTextColor} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12">
                                        <div style={{ marginTop: '10px' }} className="form-group">
                                            <label>Preview &nbsp;&nbsp;</label>
                                            <div className="label label-default" style={{ backgroundColor: editingTag.backgroundColor, color: editingTag.textColor }}>{ editingTag.name }</div>
                                        </div>
                                    </div>
                                </div>
                                <br style={{ clear: 'both' }} />

                                <a className="btn btn-primary" onClick={e => { props.createOrUpdateTag(); e.preventDefault();} }>Save</a>
                                <a className="btn btn-default pull-right" onClick={props.cancelTagEdit}>Cancel</a>
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