import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selectEntireBookSearchState, entireBookSearchStateType} from 'modules/books/reducers/bookSearch/reducer';
import {Modal} from 'simple-react-bootstrap';
import BootstrapButton from 'applicationRoot/components/bootstrapButton';

import * as bookSearchActionCreators from '../reducers/bookSearch/actionCreators';

import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect'
import {RemovableLabelDisplay} from 'applicationRoot/components/labelDisplay';
import {InputForPending, RadioForPending} from './pendingInputs';

import SelectAvailable from './availableTagsOrSubjects';

import {filterSubjects} from 'modules/books/reducers/subjects/reducer'; 
import {filterTags} from 'modules/books/reducers/tags/reducer'; 

@connect(selectEntireBookSearchState, { ...bookSearchActionCreators })
export default class BookSearchModal extends Component<entireBookSearchStateType & typeof bookSearchActionCreators, any> {
    state = {
        searchTagsValue: '',
        searchSubjectsValue: '',
        subjects: [],
        tags: []
    }
    setTagSearchVal = val => this.setState({searchTagsValue: val});
    setSubjectSearchVal = val => this.setState({searchSubjectsValue: val});

    selectSubject = subject => this.setState(state => ({ searchSubjectsValue: '', subjects: state.subjects.concat(subject._id) }));
    selectTag = tag => this.setState(state => ({ searchTagsValue: '', tags: state.tags.concat(tag._id)}));
    removeSubject = subject => this.setState(state => ({ subjects: state.subjects.filter(_id => _id != subject._id) }));
    removeTag = tag => this.setState(state => ({ tags: state.tags.filter(_id => _id != tag._id) }));

    applyFilters = evt =>{
        evt.preventDefault();
        this.props.applyFilters({
            subjects: this.state.subjects,
            tags: this.state.tags,
            search: this.searchEl.value,
            pages: this.pagesEl.value,
            pagesOperator: this.pagesDirEl.value,
        })
    }

    searchEl: any;
    pagesEl: any;
    pagesDirEl: any;

    render(){
        return (
            <Modal className="fade" show={this.props.editingFilters} onHide={this.props.endFilterChanging}>
                <Modal.Header>
                    <button type="button" className="close" onClick={this.props.endFilterChanging} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Full search</h4>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.applyFilters}>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input defaultValue={this.props.search} ref={el => this.searchEl = el} placeholder="Search title" className="form-control" />
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Pages</label>
                                    <div className="form-inline">
                                        <div style={{ marginRight: 10 }} className="form-group">
                                            <select ref={el => this.pagesDirEl = el} defaultValue={this.props.pending.pagesOperator} className="form-control">
                                                <option value="lt">{'<'}</option>
                                                <option value="gt">{'>'}</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <input defaultValue={this.props.pages} ref={el => this.pagesEl = el} type="number" placeholder="Number of pages" className="form-control" />
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
                        <button style={{display: 'none'}}></button>
                    </form>

                    <div className="row" style={{ position: 'relative' }}>
                        <div className="col-xs-3">

                            <SelectAvailable 
                                placeholder="Tags"
                                search={this.state.searchTagsValue}
                                onSearchChange={this.setTagSearchVal}
                                items={this.props.allTagsSorted}
                                currentlySelected={this.state.tags}
                                onSelect={this.selectTag}
                                filter={filterTags} />

                        </div>
                        <div className="col-xs-9">
                            <div>
                                {this.state.tags.map(_id => this.props.tagHash[_id]).map(t =>
                                    <RemovableLabelDisplay key={t._id} className="margin-left" item={t} doRemove={() => this.removeTag(t)} />)}
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className="row" style={{ position: 'relative' }}>
                        <div className="col-xs-3">
                            <SelectAvailable 
                                placeholder="Subjects"
                                search={this.state.searchSubjectsValue}
                                onSearchChange={this.setSubjectSearchVal}
                                items={this.props.subjectsUnwound}
                                currentlySelected={this.state.subjects}
                                onSelect={this.selectSubject}
                                filter={filterSubjects} />
                        </div>
                        <div className="col-xs-9">
                            <div>
                                {this.state.subjects.map(_id => this.props.subjectHash[_id]).map(s =>
                                    <RemovableLabelDisplay key={s._id} className="margin-left" item={s} doRemove={() => this.removeSubject(s)} />)}
                            </div>
                        </div>
                    </div>

                    <div className="checkbox">
                        <label>
                            <input type="checkbox" onChange={this.props.setPendingSearchChildSubjects} checked={this.props.pending.searchChildSubjects || false} /> Also search child subjects
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <BootstrapButton preset="primary" className="pull-left" onClick={this.applyFilters}>Filter</BootstrapButton>
                    <BootstrapButton preset="default" onClick={this.props.endFilterChanging}>Close</BootstrapButton>
                </Modal.Footer>
            </Modal>
        )
    }
}