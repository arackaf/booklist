import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Modal } from 'simple-react-bootstrap';

import BootstrapButton, {AjaxButton, AjaxButtonAnchor, BootstrapAnchorButton} from 'applicationRoot/components/bootstrapButton';
import * as actionCreators from '../reducers/tags/actionCreators';
import CustomColorPicker from 'applicationRoot/components/customColorPicker';
import {selectEntireTagsState, TagsStateType, filterTags} from '../reducers/tags/reducer';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect';
import ColorsPalette from 'applicationRoot/components/colorsPalette';

interface ILocalProps {
    onDone: any,
    editModalOpen: boolean
}

@connect(selectEntireTagsState, { ...actionCreators })
export default class TagEditModal extends Component<TagsStateType & ILocalProps & typeof actionCreators, any> {
    state = {
        editingTag: null,
        editingTagName: '',
        tagSearch: '',
        deletingId: '',
        saving: false,
        deleting: false
    }

    setTagSearch = value => this.setState({tagSearch: value});

    newTag = () => this.startEditing({ _id: '', name: '', backgroundColor: '', textColor: '' });
    editTag = tag => {        
        this.startEditing(tag);
        this.setTagSearch('');
    }
    startEditing = tag => this.setState({editingTag: tag, editingTagName: tag.name});
    cancelTagEdit = () => this.setState({editingTag: null});

    setNewTagName = value => this.setEditingValue('name', value);
    setNewTagBackgroundColor = value => this.setEditingValue('backgroundColor', value);
    setNewTagTextColor = value => this.setEditingValue('textColor', value);
    setEditingValue = (name, value) => this.setState(({editingTag}) => ({ editingTag: {...editingTag, [name]: value} }));

    createOrUpdateTag = () => {
        this.setState({saving: true});
        Promise
            .resolve(this.props.createOrUpdateTag(this.state.editingTag))
            .then(() => {
                this.cancelTagEdit();
                this.setTagSearch('');
                this.setState({saving: false});
            })
    }
    deleteTag = () => {
        this.setState({deleting: true});
        Promise
            .resolve(this.props.deleteTag(this.state.editingTag._id))
            .then(() => {
                this.setState({deleting: false})
                this.cancelTagEdit();
            });
    }
    
    tagName: any
    render(){
        let props = this.props,
            {tagHash, onDone, editModalOpen} = props,
            {editingTag, editingTagName, tagSearch, deletingId, deleting} = this.state,
            textColors = ['#ffffff', '#000000'];

        let deletingTag = deletingId ? tagHash[deletingId] : null,
            deleteInfo = deletingTag ? {_id: deletingTag._id, name: deletingTag.name} : null,
            searchedTags = filterTags(this.props.allTagsSorted, this.state.tagSearch);

        return (
            <Modal className="fade" show={!!editModalOpen} onHide={onDone}>
                <Modal.Header>
                    <button type="button" className="close" onClick={onDone} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Edit tags</h4>
                </Modal.Header>
                <Modal.Body style={{ paddingBottom: 0 }}>
                    <div className="visible-xs">
                        <BootstrapButton onClick={this.newTag} preset="info-xs">Add new tag <i className="fa fa-fw fa-plus"></i></BootstrapButton>
                        <br />
                        <br />
                    </div>
                    <div className="row">
                        <div className="col-xs-11">
                            <GenericLabelSelect
                                inputProps={{ placeholder: 'Edit tag', value: tagSearch, onChange: evt => this.setTagSearch(evt.target.value) }}
                                suggestions={searchedTags}
                                onSuggestionSelected={item => this.editTag(item)} />
                        </div>
                        <div className="col-xs-1" style={{ padding: 0 }}>
                            <BootstrapButton className="hidden-xs" onClick={this.newTag} preset="info-xs"><i className="fa fa-fw fa-plus-square"></i></BootstrapButton>
                        </div>
                    </div>
                    <br />

                    { editingTag ?
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                { editingTag._id ? `Edit ${editingTagName}` : 'New Tag' }
                                { editingTag && editingTag._id ? <BootstrapButton onClick={e => this.setState({deletingId: editingTag._id})} preset="danger-xs" className="pull-right"><i className="fa fa-fw fa-trash"></i></BootstrapButton> : null }
                            </div>
                            <div className="panel-body">
                                <div>
                                    {deleteInfo ?
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <h4>Delete tag {editingTagName}</h4>

                                                <div style={{ marginTop: '5px'}}>
                                                    <AjaxButton running={deleting} runningText="Deleting" onClick={this.deleteTag} preset="danger-sm">Delete</AjaxButton>
                                                    <BootstrapAnchorButton onClick={() => this.setState({deletingId: ''})} deleting={deleting} runningText="Deleting..." preset="default-sm" className="pull-right">Cancel</BootstrapAnchorButton>
                                                </div>
                                                <hr />
                                            </div>
                                        </div> : null}
                                    <div className="row">
                                        <div className="col-xs-6">
                                            <div className="form-group">
                                                <label>Tag name</label>
                                                <input className="form-control" value={editingTag.name} onChange={evt => this.setNewTagName(evt.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-xs-9">
                                            <div className="form-group">
                                                <label>Label color</label>
                                                <div>
                                                    <ColorsPalette currentColor={editingTag.backgroundColor} colors={props.colors} onColorChosen={this.setNewTagBackgroundColor} />
                                                    <CustomColorPicker onColorChosen={this.setNewTagBackgroundColor} currentColor={editingTag.backgroundColor} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-3">
                                            <div className="form-group">
                                                <label>Text color</label>
                                                <div>
                                                    <ColorsPalette colors={textColors} onColorChosen={this.setNewTagTextColor} />
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

                                    <AjaxButtonAnchor className="btn btn-primary" running={this.state.saving} runningText={'Saving...'} onClick={this.createOrUpdateTag}>Save</AjaxButtonAnchor>
                                    <a className="btn btn-default pull-right" onClick={this.cancelTagEdit}>Cancel</a>
                                </div>
                            </div>
                        </div>
                        : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <BootstrapButton onClick={onDone}>Close</BootstrapButton>
                </Modal.Footer>
            </Modal>
        )
    }
}