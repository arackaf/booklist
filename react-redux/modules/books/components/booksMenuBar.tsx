import React, {Component} from 'react';
import { connect } from 'react-redux';
import {NavBar} from 'simple-react-bootstrap';

import {BootstrapAnchorButton} from 'applicationRoot/components/bootstrapButton';

import {selectBookSelection, bookSelectionType} from 'modules/books/reducers/books/reducer';
import {selectEntireBookSearchState, entireBookSearchStateType} from 'modules/books/reducers/bookSearch/reducer';

import * as booksActionCreators from '../reducers/books/actionCreators';
import * as bookSearchActionCreators from '../reducers/bookSearch/actionCreators';
import * as subjectsActionCreators from '../reducers/subjects/actionCreators';
import * as tagsActionCreators from '../reducers/tags/actionCreators';
import * as booksSubjectModificationActionCreators from '../reducers/booksSubjectModification/actionCreators';
import * as booksTagModificationActionCreators from '../reducers/booksTagModification/actionCreators';

import {RemovableLabelDisplay} from 'applicationRoot/components/labelDisplay';
import {InputForPending, RadioForPending} from './pendingInputs';

import {BooksModuleType} from 'modules/books/reducers/reducer';

type bookMenuBarType = entireBookSearchStateType & {
    showingMobile: boolean;
    showingDesktop: boolean;
    booksLoading: boolean;        
    isPublic: boolean;
    publicBooksHeader: string;
    publicName: string;
    resultsCount: number;
}

type bookUtilMenuOptionsType = bookSelectionType & {
    viewingPublic: boolean;
}

const menuBarSelector = (state : BooksModuleType) : bookMenuBarType => {
    return {
        ...selectEntireBookSearchState(state),
        resultsCount: state.booksModule.books.resultsCount,
        showingMobile: state.app.showingMobile,
        showingDesktop: state.app.showingDesktop,
        booksLoading: state.booksModule.books.booksLoading,
        isPublic: state.app.isPublic,
        publicBooksHeader: state.app.publicBooksHeader,
        publicName: state.app.publicName
    }
}

const utilMenuOptionsSelector = (state) : bookUtilMenuOptionsType => {
    return {
        ...selectBookSelection(state),
        viewingPublic: state.app.isPublic        
    };
}

@connect(menuBarSelector, { ...bookSearchActionCreators })
export default class BooksMenuBar extends Component<bookMenuBarType & typeof bookSearchActionCreators, any> {
    navBar: any
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

        let {isPublic, publicBooksHeader, publicName, anyActiveFilters} = this.props;
        let booksHeader = isPublic ? (publicBooksHeader || (`${publicName}'s Books`)) : 'Your Books';

        let UtilMenu : any = UtilMenuOptions,
            resultsCount = this.props.resultsCount,
            resultsDisplay = resultsCount ? `${resultsCount} book${resultsCount === 1 ? '' : 's'} found` : '',
            removeAllFiltersLabel = {
                backgroundColor: 'red',
                textColor: 'white',
                name: 'Remove all filters'
            };

        return (
            <div style={{position: 'sticky', top: 50, zIndex: 499}}>
                <NavBar ref={el => this.navBar = el} style={{ border: 0, borderRadius: 0 }}>
                    <NavBar.Header>
                        <NavBar.Brand>
                            <a style={{ cursor: 'default' }}>{booksHeader}</a>
                        </NavBar.Brand>
                        <NavBar.Toggle />
                    </NavBar.Header>
                    <UtilMenu />
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
                                </div>
                            }
                        </div>

                        {this.props.showingDesktop ?
                            <div className="btn-group" role="group">
                                <button type="button" onClick={this.props.setViewDesktop} className={'btn btn-default ' + (this.props.isGridView ? 'active' : '')}><i className="fa fa-fw fa-table"></i></button>
                                <button type="button" onClick={this.props.setViewBasicList} className={'btn btn-default ' + (this.props.isBasicList ? 'active' : '')}><i className="fa fa-fw fa-list"></i></button>
                                { 0 ? <button type="button" className="btn btn-default"><i className="fa fa-fw fa-th"></i></button> : null }
                            </div> : null
                        }
                        {resultsCount ? <h5 style={{display: 'inline', marginLeft: '10px', verticalAlign: 'middle'}}>{resultsDisplay}</h5> : null}

                    </NavBar.Form>
                    
                    {anyActiveFilters ? 
                        <NavBar.Nav>
                            <NavBar.Dropdown keepOpenIfItemClickedNoLongerInDocument={true} ignoreContentClick={true} text={'Quick filters'}>
                                {selectedSubjectsCount ? (
                                    <li style={{padding: '3px 20px'}}>
                                        <span>Subjects</span>
                                    </li>
                                ) : null}

                                { this.props.selectedSubjects.map(s =>
                                    <li style={{padding: '3px 20px'}} className="default-cursor no-hover" key={s._id}>
                                        <RemovableLabelDisplay item={s} doRemove={() => this.props.removeFilterSubject(s._id)} />
                                    </li>
                                )}

                                {!!this.props.searchChildSubjects ? <NavBar.ItemDivider /> : null }
                                {!!this.props.searchChildSubjects ?
                                    <li style={{paddingLeft: '20px', paddingRight: '20px', marginTop: '-5px'}} className="default-cursor no-hover">
                                        <span style={{ color: 'white' }}  className={'label label-primary'}>
                                            <a onClick={this.props.clearSearchChildSubjects} style={{ color: 'white', cursor: 'pointer' }}>X</a>
                                            <span style={{ marginLeft: 5, paddingLeft: 5, borderLeft: '1px solid white' }}>Searching child subjects</span>
                                        </span>
                                    </li> : null
                                }
                                {selectedSubjectsCount && selectedTagsCount ? <NavBar.ItemDivider /> : null}
                                {selectedTagsCount ? (
                                    <li style={{padding: '3px 20px'}}>
                                        <span>Tags</span>
                                    </li>
                                ) : null}
                                { this.props.selectedTags.map(t =>
                                    <li style={{padding: '3px 20px'}} className="default-cursor no-hover" key={t._id}>
                                        <RemovableLabelDisplay item={t} doRemove={() => this.props.removeFilterTag(t._id)} />
                                    </li>)
                                }

                                {selectedSubjectsCount || selectedTagsCount ? <NavBar.ItemDivider /> : null}
                                <li style={{padding: '3px 20px'}} className="default-cursor no-hover" key={-1}>
                                    <RemovableLabelDisplay item={removeAllFiltersLabel} doRemove={this.props.clearAllFilters} />
                                </li>

                                <li style={{height: '5px'}}></li>
                                
                            </NavBar.Dropdown>
                        </NavBar.Nav> : null
                    }
                </NavBar>
            </div>
        )
    }
}

type utilMenuOptionsComponentType = bookUtilMenuOptionsType &
                                    typeof booksActionCreators &
                                    typeof subjectsActionCreators & 
                                    typeof booksSubjectModificationActionCreators & 
                                    typeof booksTagModificationActionCreators &
                                    typeof tagsActionCreators;
@connect(utilMenuOptionsSelector, { ...booksActionCreators, ...subjectsActionCreators, ...booksSubjectModificationActionCreators, ...booksTagModificationActionCreators, ...tagsActionCreators })
class UtilMenuOptions extends Component<utilMenuOptionsComponentType, any> {
    render() {
        return (
            <NavBar.Nav>
                <NavBar.Dropdown disabled={this.props.viewingPublic} text='Admin'>
                    <NavBar.Item onClick={this.props.editSubjects}>Edit subjects</NavBar.Item>
                    <NavBar.Item onClick={this.props.editTags}>Edit tags</NavBar.Item>
                </NavBar.Dropdown>

                <NavBar.Dropdown disabled={!this.props.selectedBooksCount || this.props.viewingPublic} text='Selected books' style={{ marginRight: '5px' }}>
                    <NavBar.Item onClick={this.props.enableSubjectModificationToggledBooks}>Set subjects</NavBar.Item>
                    <NavBar.Item onClick={this.props.enableTagModificationToggledBooks}>Set tags</NavBar.Item>
                    <NavBar.Item onClick={this.props.setSelectedRead}>Set all read</NavBar.Item>
                    <NavBar.Item onClick={this.props.setSelectedUnRead}>Set all un-read</NavBar.Item>
                </NavBar.Dropdown>
            </NavBar.Nav>
        );
    }
}