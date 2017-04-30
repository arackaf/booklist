import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bookSearchSelector} from 'modules/books/reducers/bookSearch/reducer';
import {Modal} from 'simple-react-bootstrap';
import BootstrapButton from 'applicationRoot/components/bootstrapButton';

import * as bookSearchActionCreators from '../reducers/bookSearch/actionCreators';

import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect'
import {RemovableLabelDisplay} from 'applicationRoot/components/labelDisplay';
import {InputForPending, RadioForPending} from './pendingInputs';

@connect(bookSearchSelector, { ...bookSearchActionCreators })
export default class BookSearchModal extends Component {
    render(){
        return (
            <Modal className="fade" show={this.props.editingFilters} onHide={this.props.endFilterChanging}>
                <Modal.Header closeButton>
                    <button type="button" className="close" onClick={this.props.endFilterChanging} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Full search</h4>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Title</label>
                                    <InputForPending name="search" parentProps={this.props} placeholder="Search title" />
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Pages</label>
                                    <div className="form-inline">
                                        <div style={{ marginRight: 10 }} className="form-group">
                                            <select onChange={this.props.setPendingPagesOperator} value={this.props.pending.pagesOperator} className="form-control">
                                                <option value="lt">{'<'}</option>
                                                <option value="gt">{'>'}</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <InputForPending name="pages" parentProps={this.props} type="number" placeholder="Number of pages" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Publisher</label>
                                    <InputForPending name="publisher" parentProps={this.props} placeholder="Publisher" />
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Author</label>
                                    <InputForPending name="author" parentProps={this.props} placeholder="Author" />
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Is read?</label>
                                    <br />
                                    <div style={{display: 'inline'}} className="radio">
                                        <label>
                                            <RadioForPending name="isRead" parentProps={this.props} value={''} />
                                            Either
                                        </label>
                                    </div>
                                    <div style={{display: 'inline', marginLeft: '20px'}} className="radio">
                                        <label>
                                            <RadioForPending name="isRead" parentProps={this.props} value='1' />
                                            Yes
                                        </label>
                                    </div>
                                    <div style={{display: 'inline', marginLeft: '20px'}} className="radio">
                                        <label>
                                            <RadioForPending name="isRead" parentProps={this.props} value='0' />
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="row" style={{ position: 'relative' }}>
                        <div className="col-xs-3">
                            <GenericLabelSelect
                                inputProps={{ placeholder: 'Tags', value: this.props.searchTagsValue, onChange: this.props.setSearchTagsValue }}
                                suggestions={this.props.eligibleFilterTags}
                                onSuggestionSelected={this.props.addPendingTag} />
                        </div>
                        <div className="col-xs-9">
                            <div>
                                {this.props.pendingSelectedTags.map(t =>
                                    <RemovableLabelDisplay className="margin-left" item={t} doRemove={() => this.props.removePendingTag(t._id)} />)}
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className="row" style={{ position: 'relative' }}>
                        <div className="col-xs-3">
                            <GenericLabelSelect
                                inputProps={{ placeholder: 'Subjects', value: this.props.searchSubjectsValue, onChange: this.props.setSearchSubjectsValue }}
                                suggestions={this.props.eligibleFilterSubjects}
                                onSuggestionSelected={this.props.addPendingSubject} />
                        </div>
                        <div className="col-xs-9">
                            <div>
                                {this.props.pendingSelectedSubjects.map(s =>
                                    <RemovableLabelDisplay className="margin-left" item={s} doRemove={() => this.props.removePendingSubject(s._id)} />)}
                            </div>
                        </div>
                    </div>

                    <div className="checkbox">
                        <label>
                            <input type="checkbox" onChange={this.props.setPendingSearchChildSubjects} checked={this.props.pending.searchChildSubjects} /> Also search child subjects
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <BootstrapButton preset="primary" className="pull-left" onClick={this.props.applyFilters}>Filter</BootstrapButton>
                    <BootstrapButton preset="default" onClick={this.props.endFilterChanging}>Close</BootstrapButton>
                </Modal.Footer>
            </Modal>
        )
    }
}