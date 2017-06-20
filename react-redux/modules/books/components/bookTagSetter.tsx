import React, {Component} from 'react';
import { connect } from 'react-redux';

import BootstrapButton, { AjaxButton } from 'applicationRoot/components/bootstrapButton';
import { Modal } from 'simple-react-bootstrap';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect';
import SelectAvailable from './availableTagsOrSubjects';

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
    tagSelectedToAdd = this.addingTagSet.bind(null, true);
    removingTagSet = (adding, {_id}) => {
        this.setState({
            removingTags: adding ? this.state.removingTags.concat(_id) : this.state.removingTags.filter(x => x != _id),
            removingTagSearch: adding ? '' : this.state.removingTagSearch
        });
    }
    tagSelectedToRemove = this.removingTagSet.bind(null, true);
    resetTags = () => {
        this.setState({
            addingTags: [],
            removingTags: []
        });
    }
    setAddingSearchVal = val => this.setState({addingTagSearch: val});
    setRemovingSearchVal = val => this.setState({removingTagSearch: val + ''});

    render(){
        let dontAddTag = this.addingTagSet.bind(null, false),
            dontRemoveTag = this.removingTagSet.bind(null, false);

        return (
            <Modal className="fade" show={!!this.props.modifyingBooks.length} onHide={this.props.onDone}>
                <Modal.Header>
                    <button type="button" className="close" onClick={this.props.onDone} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Add / Remove Tags:</h4>
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
                                    <SelectAvailable 
                                        placeholder="Adding"
                                        search={this.state.addingTagSearch}
                                        onSearchChange={this.setAddingSearchVal}
                                        items={this.props.allTagsSorted}
                                        currentlySelected={this.state.addingTags}
                                        onSelect={this.tagSelectedToAdd}
                                        filter={filterTags} />
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
                                    <SelectAvailable 
                                        placeholder="Removing"
                                        search={this.state.removingTagSearch}
                                        onSearchChange={this.setRemovingSearchVal}
                                        items={this.props.allTagsSorted}
                                        currentlySelected={this.state.removingTags}
                                        onSelect={this.tagSelectedToRemove}
                                        filter={filterTags} />
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