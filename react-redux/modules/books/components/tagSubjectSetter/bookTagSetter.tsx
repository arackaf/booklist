import React, {Component} from 'react';
import { connect } from 'react-redux';

import BootstrapButton, { AjaxButton } from 'applicationRoot/components/bootstrapButton';
import { Modal } from 'simple-react-bootstrap';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect';

import {setBooksTags} from 'modules/books/reducers/books/actionCreators'; 
import {filterTags} from 'modules/books/reducers/tags/reducer'; 
import {selectEntireTagsState, TagsStateType} from 'modules/books/reducers/tags/reducer'; 
const {createSelector} = require('reselect');

interface ILocalProps {
    modifyingBooks: any[];
    onDone: any;
}

@connect(selectEntireTagsState, {setBooksTags})
export default class BookTagSetterDesktopUnConnected extends Component<TagsStateType & {setBooksTags} & ILocalProps, any> {
    state = { 
        currentTab: 'tags',
        addingTags: [],
        removingTags: [],
        addingTagSearch: '',
        removingTagSearch: '',
        saving: false
    };    
    
    _eligibleToAdd = createSelector(o => o.tags, o => o.adding, o => o.filter,
        (tags, adding, filter) => {
            let addingHash = adding.reduce((hash, _id) => (hash[_id] = true, hash), {});
            return filterTags(tags.filter(s => !addingHash[s._id]), filter);
        }
    )
    eligibleToAdd = () => this._eligibleToAdd({tags: this.props.allTagsSorted, adding: this.state.addingTags, filter: this.state.addingTagSearch});

    _eligibleToRemove = createSelector(o => o.tags, o => o.removing, o => o.filter,
        (tags, removing, filter) => {
            let addingHash = removing.reduce((hash, _id) => (hash[_id] = true, hash), {});
            return filterTags(tags.filter(s => !addingHash[s._id]), filter);
        }
    )
    eligibleToRemove = () => this._eligibleToRemove({tags: this.props.allTagsSorted, removing: this.state.removingTags, filter: this.state.removingTagSearch});

    setBooksTags = () => {
        this.setState({saving: true});
        Promise.resolve(
            this.props.setBooksTags(
                this.props.modifyingBooks.map(b => b._id),
                this.state.addingTags,
                this.state.removingTags
            )
        ).then(() => {
            this.setState({saving: false});
            this.props.onDone();
        });
    }
    addingTagSet = (adding, {_id}) => {
        this.setState({
            addingTags: adding ? this.state.addingTags.concat(_id) : this.state.addingTags.filter(x => x != _id),
            addingTagSearch: adding ? '' : this.state.addingTagSearch
        });
    }
    removingTagSet = (adding, {_id}) => {
        this.setState({
            removingTags: adding ? this.state.removingTags.concat(_id) : this.state.removingTags.filter(x => x != _id),
            removingTagSearch: adding ? '' : this.state.removingTagSearch
        });
    }
    resetTags = () => {
        this.setState({
            addingTags: [],
            removingTags: []
        });
    }
    render(){
        let tagSelectedToAdd = this.addingTagSet.bind(null, true),
            tagSelectedToRemove = this.removingTagSet.bind(null, true);

        let dontAddTag = this.addingTagSet.bind(null, false),
            dontRemoveTag = this.removingTagSet.bind(null, false);

        return (
            <Modal className="fade" show={!!this.props.modifyingBooks.length} onHide={this.props.onDone}>
                <Modal.Header>
                    <button type="button" className="close" onClick={this.props.onDone} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Edit tags:</h4>
                </Modal.Header>
                <Modal.Body>
                    <ul className="nav nav-tabs">
                        <li className={this.state.currentTab == 'tags' ? 'active' : ''}>
                            <a onClick={() => this.setState({currentTab: 'tags'})}>Choose tags</a>
                        </li>
                        <li className={this.state.currentTab == 'books' ? 'active' : ''}>
                            <a onClick={() => this.setState({currentTab: 'books'})}>For books</a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div style={{ minHeight: '150px' }} className={'tab-pane ' + (this.state.currentTab == 'tags' ? 'active in' : '')}>
                            <br />
                            <div style={{ position: 'relative' }} className="row">
                                <div className="col-xs-3">
                                    <GenericLabelSelect
                                        inputProps={{ placeholder: 'Adding', value: this.state.addingTagSearch, onChange: evt => this.setState({addingTagSearch: evt.target.value}) }}
                                        suggestions={this.eligibleToAdd()}
                                        onSuggestionSelected={tagSelectedToAdd} />
                                </div>
                                <div className="col-xs-9">
                                    <div>
                                        {this.state.addingTags.map(_id => this.props.tagHash[_id]).map((s : any, i) =>
                                            <span key={i} style={{ color: s.textColor || 'white', backgroundColor: s.backgroundColor, display: 'inline-table' }} className="label label-default margin-left">
                                                <a onClick={() => dontAddTag(s)} style={{ color: s.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{s.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <br />

                            <div style={{ position: 'relative' }} className="row">
                                <div className="col-xs-3">
                                    <GenericLabelSelect
                                        inputProps={{ placeholder: 'Removing', value: this.state.removingTagSearch, onChange: evt => this.setState({removingTagSearch: evt.target.value}) }}
                                        suggestions={this.eligibleToRemove()}
                                        onSuggestionSelected={tagSelectedToRemove} />
                                </div>
                                <div className="col-xs-9">
                                    <div>
                                        {this.state.removingTags.map(_id => this.props.tagHash[_id]).map((s : any, i) =>
                                            <span key={i} style={{ color: s.textColor || 'white', backgroundColor: s.backgroundColor, display: 'inline-table' }} className="label label-default margin-left">
                                                <a onClick={() => dontRemoveTag(s)} style={{ color: s.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{s.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <br />
                            <BootstrapButton onClick={this.resetTags} className="pull-right" preset="default-xs">Reset tags</BootstrapButton>
                            <br />
                        </div>
                        <div style={{ minHeight: '150px' }} className={'tab-pane ' + (this.state.currentTab == 'books' ? 'active in' : '')}>
                            <br />
                            <ul className="list-unstyled">
                                { this.props.modifyingBooks.map(book => <li key={book._id}>{book.title}</li>) }
                            </ul>
                            <br />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton preset="primary" running={this.state.saving} runningText='Setting' onClick={() => this.setBooksTags()}>Set</AjaxButton>
                    <BootstrapButton preset="" onClick={this.props.onDone}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}