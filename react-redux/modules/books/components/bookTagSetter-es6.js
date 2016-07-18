import React from 'react';
import { connect } from 'react-redux';
import BootstrapButton from 'applicationRoot/components/bootstrapButton';
import AjaxButton from 'applicationRoot/components/ajaxButton';
import { booksTagsModifierSelector } from '../reducers/booksTagModification/reducer';
import * as bookTagModificationActionCreators from '../reducers/booksTagModification/actionCreators';

import { Modal, Tabs, Tab } from 'react-bootstrap';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect'

class BookTagSetterDesktopUnConnected extends React.Component {
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
            <Modal show={!!this.props.modifyingBooks.length} onHide={this.props.cancelBookTagModification}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit tags for:
                        <div>{ this.props.modifyingBooks.map(book => <h5 key={book._id}>{book.title}</h5>) }</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Tabs animation={false} defaultActiveKey={1}>
                        <Tab eventKey={1} title="Choose tags" style={{ minHeight: '150px' }}>
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

                        </Tab>
                        <Tab eventKey={2} title="For books" style={{ minHeight: '150px' }}>
                            <br />
                            Hello world
                        </Tab>
                    </Tabs>

                    <br />

                    <BootstrapButton onClick={this.props.resetTags} className="pull-right" preset="default-xs">Reset tags</BootstrapButton>
                    <br />
                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton preset="primary" running={this.props.settingBooksTags} runningText='Setting' onClick={() => this.setBooksTags()}>Set</AjaxButton>
                    <BootstrapButton preset="" onClick={this.props.cancelBookTagModification}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

const BookTagSetterDesktop = connect(booksTagsModifierSelector, { ...bookTagModificationActionCreators })(BookTagSetterDesktopUnConnected);

export default BookTagSetterDesktop;