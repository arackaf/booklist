import React from 'react';
import { connect } from 'react-redux';
import {NavBar} from 'simple-react-bootstrap';

import {BootstrapAnchorButton} from 'applicationRoot/components/bootstrapButton';

import {bookSearchSelector} from 'modules/books/reducers/bookSearch/reducer';

import * as booksActionCreators from '../reducers/books/actionCreators';
import * as bookSearchActionCreators from '../reducers/bookSearch/actionCreators';
import * as subjectsActionCreators from '../reducers/subjects/actionCreators';
import * as tagsActionCreators from '../reducers/tags/actionCreators';
import * as booksSubjectModificationActionCreators from '../reducers/booksSubjectModification/actionCreators';
import * as booksTagModificationActionCreators from '../reducers/booksTagModification/actionCreators';
import {globalHashManager} from 'reactStartup';

import {RemovableLabelDisplay} from 'applicationRoot/components/labelDisplay';
import {InputForPending, RadioForPending} from './pendingInputs';

@connect(bookSearchSelector, { ...bookSearchActionCreators, ...booksActionCreators, ...subjectsActionCreators, ...booksSubjectModificationActionCreators, ...booksTagModificationActionCreators, ...tagsActionCreators })
export default class BooksMenuBar extends React.Component {
    removeFilterSubject(_id){
        this.props.removeFilterSubject(_id);
    }
    removeFilterTag(_id) {
        this.props.removeFilterTag(_id);
    }
    sortChanged(evt){
        let value = evt.target.value,
            [sort, direction] = value.split('|');

        this.props.setSortOrder(sort, direction == 'asc' ? 1 : 0);
    }
    componentDidUpdate(prevProps){
        if (!prevProps.booksLoading && this.props.booksLoading){
            this.navBar.closeIfOpen();
        }
    }
    render(){
        let selectedSubjectsCount = this.props.selectedSubjects.length,
            selectedTagsCount = this.props.selectedTags.length,
            selectedSubjectsHeader = 'Searching ' + selectedSubjectsCount + ' Subject' + (selectedSubjectsCount === 1 ? '' : 's'),
            selectedTagsHeader = 'Searching ' + selectedTagsCount + ' Tag' + (selectedTagsCount === 1 ? '' : 's');

        return (
            <div style={{position: 'sticky', top: 50, zIndex: 499}}>
                <NavBar ref={el => this.navBar = el} style={{ border: 0, borderRadius: 0 }}>
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
            </div>
        )
    }
}