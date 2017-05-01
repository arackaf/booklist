import React, {Component} from 'react';
import { connect } from 'react-redux';
import BootstrapButton, { AjaxButton } from 'applicationRoot/components/bootstrapButton';
import { booksTagsModifierSelector, booksTagsModifierType } from '../reducers/booksTagModification/reducer';
import * as bookTagModificationActionCreators from '../reducers/booksTagModification/actionCreators';

import { Modal } from 'simple-react-bootstrap';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect'

@connect(booksTagsModifierSelector, { ...bookTagModificationActionCreators })
export default class BookTagSetterDesktopUnConnected extends Component<booksTagsModifierType & typeof bookTagModificationActionCreators, any> {
    state = { currentTab: 'tags' };
    setBooksTags(){
        this.props.setBooksTags(
            this.props.modifyingBooks.map(b => b._id),
            this.props.addingTags.map(s => s._id),
            this.props.removingTags.map(s => s._id));
    }
    render(){
        let tagSelectedToAdd = this.props.addingTagSet.bind(null, true),
            tagSelectedToRemove = this.props.removingTagSet.bind(null, true);

        let dontAddTag = this.props.addingTagSet.bind(null, false),
            dontRemoveTag = this.props.removingTagSet.bind(null, false);

        return (
            <Modal className="fade" show={!!this.props.modifyingBooks.length} onHide={this.props.cancelBookTagModification}>
                <Modal.Header>
                    <button type="button" className="close" onClick={this.props.cancelBookTagModification} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Edit tags:</h4>
                </Modal.Header>
                <Modal.Body>
                    <ul className="nav nav-tabs">
                        <li className={this.state.currentTab == 'tags' ? 'active' : ''}>
                            <a onClick={() => this.setState({currentTab: 'tags'})}>Choose subjects</a>
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
                                        inputProps={{ placeholder: 'Adding', value: this.props.addingTagSearch, onChange: this.props.addingSearchValueChange }}
                                        suggestions={this.props.eligibleToAdd}
                                        onSuggestionSelected={tagSelectedToAdd} />
                                </div>
                                <div className="col-xs-9">
                                    <div>
                                        { this.props.addingTags.map(s =>
                                            <span style={{ color: s.textColor || 'white', backgroundColor: s.backgroundColor, display: 'inline-table' }} className="label label-default margin-left">
                                                <a onClick={() => dontAddTag(s)} style={{ color: s.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{s.name}
                                            </span>) }
                                    </div>
                                </div>
                            </div>

                            <br />

                            <div style={{ position: 'relative' }} className="row">
                                <div className="col-xs-3">
                                    <GenericLabelSelect
                                        inputProps={{ placeholder: 'Removing', value: this.props.removingTagSearch, onChange: this.props.removingSearchValueChange }}
                                        suggestions={this.props.eligibleToRemove}
                                        onSuggestionSelected={tagSelectedToRemove} />
                                </div>
                                <div className="col-xs-9">
                                    <div>
                                        { this.props.removingTags.map(s =>
                                            <span style={{ color: s.textColor || 'white', backgroundColor: s.backgroundColor, display: 'inline-table' }} className="label label-default margin-left">
                                                <a onClick={() => dontRemoveTag(s)} style={{ color: s.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{s.name}
                                            </span>) }
                                    </div>
                                </div>
                            </div>

                            <br />
                            <BootstrapButton onClick={this.props.resetTags} className="pull-right" preset="default-xs">Reset tags</BootstrapButton>
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
                    <AjaxButton preset="primary" running={this.props.settingBooksTags} runningText='Setting' onClick={() => this.setBooksTags()}>Set</AjaxButton>
                    <BootstrapButton preset="" onClick={this.props.cancelBookTagModification}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}