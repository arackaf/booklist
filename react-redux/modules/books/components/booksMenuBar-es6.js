import React from 'react';
import { connect } from 'react-redux';
import {Modal, NavBar} from 'simple-react-bootstrap';

import BootstrapButton, {BootstrapAnchorButton} from 'applicationRoot/components/bootstrapButton';

import {bookSearchSelector} from 'modules/books/reducers/bookSearch/reducer';

import * as booksActionCreators from '../reducers/books/actionCreators';
import * as bookSearchActionCreators from '../reducers/bookSearch/actionCreators';
import * as subjectsActionCreators from '../reducers/subjects/actionCreators';
import * as tagsActionCreators from '../reducers/tags/actionCreators';
import * as booksSubjectModificationActionCreators from '../reducers/booksSubjectModification/actionCreators';
import * as booksTagModificationActionCreators from '../reducers/booksTagModification/actionCreators';
import {globalHashManager} from 'reactStartup';

import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect'
import { RemovableLabelDisplay } from 'applicationRoot/components/labelDisplay';

const InputForPending = props => {
    let name = props.name,
        actionName = `setPending${name[0].toUpperCase()}${name.slice(1)}`,
        parentProps = props.parentProps;
    return <input { ...props } className={`form-control ${props.className || ''}`} onKeyDown={parentProps[actionName]} onChange={parentProps[actionName]} value={parentProps.pending[name]} />;
}

const RadioForPending = props => {
    let {name, value, parentProps, ...rest} = props,
        actionName = `setPending${name[0].toUpperCase()}${name.slice(1)}`;

    return <input { ...rest } type="radio" className={`${props.className || ''}`} onClick={parentProps[actionName]} checked={parentProps.pending[name] === value} value={value} />;
}

class BooksMenuBar extends React.Component {
    removeFilterSubject(_id){
        let isLastSubject = this.props.selectedSubjects.length === 1;
        this.props.removeFilterSubject(_id);
    }
    removeFilterTag(_id) {
        let isLastTag = this.props.selectedTags.length === 1;
        this.props.removeFilterTag(_id);
    }
    sortChanged(evt){
        let value = evt.target.value,
            [sort, direction] = value.split('|');

        this.props.setSortOrder(sort, direction == 'asc' ? 1 : 0);
    }
    render(){
        let selectedSubjectsCount = this.props.selectedSubjects.length,
            selectedTagsCount = this.props.selectedTags.length,
            selectedSubjectsHeader = 'Searching ' + selectedSubjectsCount + ' Subject' + (selectedSubjectsCount === 1 ? '' : 's'),
            selectedTagsHeader = 'Searching ' + selectedTagsCount + ' Tag' + (selectedTagsCount === 1 ? '' : 's');

        return (
            <div style={{position: 'sticky', top: 50, zIndex: 9999}}>
                <NavBar style={{ border: 0, borderRadius: 0 }}>
                    <NavBar.Header>
                        <NavBar.Brand>
                            <a style={{ cursor: 'default' }}>Your books</a>
                        </NavBar.Brand>
                        <NavBar.Toggle />
                    </NavBar.Header>
                    <NavBar.Nav>
                        <NavBar.Item onClick={this.props.editSubjects} disabled={this.props.viewingPublic}>Edit subjects</NavBar.Item>
                        <NavBar.Item onClick={this.props.editTags} disabled={this.props.viewingPublic}>Edit tags</NavBar.Item>

                        <NavBar.Dropdown disabled={!this.props.selectedBooksCount || this.props.viewingPublic} text='Edit selected books' style={{ marginRight: '5px' }}>
                            <NavBar.Item onClick={this.props.enableSubjectModificationToggledBooks}>Set subjects</NavBar.Item>
                            <NavBar.Item onClick={this.props.enableTagModificationToggledBooks}>Set tags</NavBar.Item>
                            <NavBar.Item onClick={this.props.setSelectedRead}>Set all read</NavBar.Item>
                            <NavBar.Item onClick={this.props.setSelectedUnRead}>Set all un-read</NavBar.Item>
                        </NavBar.Dropdown>
                    </NavBar.Nav>
                    <NavBar.Header>
                        <NavBar.Brand>
                            <a style={{ cursor: 'default' }}>Filters</a>
                        </NavBar.Brand>
                    </NavBar.Header>
                    <NavBar.Form className="navbar-left">
                        <div className="form-group" style={{ marginRight: '5px' }}>
                            {this.props.showingMobile ?
                                <div>
                                    <BootstrapAnchorButton style={{ width: '100%' }} className="margin-bottom" preset="default" onClick={this.props.beginFilterChange}>Open full search modal</BootstrapAnchorButton>

                                    <InputForPending className="margin-bottom" name="search" parentProps={this.props} placeholder="Quick title search" />

                                    <select value={this.props.bindableSortValue} onChange={evt => this.sortChanged(evt)} className="form-control margin-bottom">
                                        <option value="title|asc">Title A-Z</option>
                                        <option value="title|desc">Title Z-A</option>
                                        <option value="pages|asc">Pages, Low</option>
                                        <option value="pages|desc">Pages, High</option>
                                        <option value="_id|asc">Created, Earliest</option>
                                        <option value="_id|desc">Created, Latest</option>
                                    </select>
                                </div>
                                : <div className="input-group">
                                    <span className="input-group-btn">
                                        <BootstrapAnchorButton preset="default" onClick={this.props.beginFilterChange}>Full search</BootstrapAnchorButton>
                                    </span>
                                    <InputForPending name="search" parentProps={this.props} placeholder="Quick title search" />
                                </div> }
                        </div>

                        {this.props.showingDesktop ?
                            <div className="btn-group" role="group">
                                <button type="button" onClick={this.props.setViewDesktop} className={'btn btn-default ' + (this.props.isGridView ? 'active' : '')}><i className="fa fa-fw fa-table"></i></button>
                                <button type="button" onClick={this.props.setViewBasicList} className={'btn btn-default ' + (this.props.isBasicList ? 'active' : '')}><i className="fa fa-fw fa-list"></i></button>
                                { 0 ? <button type="button" className="btn btn-default"><i className="fa fa-fw fa-th"></i></button> : null }
                            </div> : null
                        }

                    </NavBar.Form>
                    { selectedSubjectsCount ?
                        <NavBar.Nav>
                            <NavBar.Dropdown ignoreContentClick={true} text={selectedSubjectsHeader} id="sel-subjects-dropdown">
                                { this.props.selectedSubjects.map(s =>
                                    <NavBar.Item className="default-cursor no-hover" key={s._id}>
                                        <RemovableLabelDisplay item={s} doRemove={() => this.removeFilterSubject(s._id)} />
                                    </NavBar.Item>)
                                }

                                { !!this.props.searchChildSubjects ? <NavBar.ItemDivider /> : null }
                                { !!this.props.searchChildSubjects ?
                                    <NavBar.Item className="default-cursor no-hover">
                                        <span className="label label-primary">Searching child subjects</span>
                                    </NavBar.Item> : null
                                }
                            </NavBar.Dropdown>
                        </NavBar.Nav> : null
                    }

                    { selectedTagsCount ?
                        <NavBar.Nav>
                            <NavBar.Dropdown ignoreContentClick={true} text={selectedTagsHeader} id="sel-tags-dropdown">
                                { this.props.selectedTags.map(t =>
                                    <NavBar.Item className="default-cursor no-hover" key={t._id}>
                                        <RemovableLabelDisplay item={t} doRemove={() => this.removeFilterTag(t._id)} />
                                    </NavBar.Item>)
                                }
                            </NavBar.Dropdown>
                        </NavBar.Nav> : null
                    }
                </NavBar>

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
            </div>
        )
    }
}

const BooksMenuBarConnected = connect(bookSearchSelector, { ...bookSearchActionCreators, ...booksActionCreators, ...subjectsActionCreators, ...booksSubjectModificationActionCreators, ...booksTagModificationActionCreators, ...tagsActionCreators })(BooksMenuBar);

export default BooksMenuBarConnected;