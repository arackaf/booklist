import React from 'react';
import { connect } from 'react-redux';
import {
    Modal,
    Nav,
    Navbar,
    NavItem,
    NavDropdown,
    DropDownButton,
    MenuItem
} from 'react-bootstrap';

import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';

import { bookSearchSelector } from 'modules/books/reducers/bookSearch/reducer';

import * as booksActionCreators from '../../reducers/books/actionCreators';
import * as bookSearchActionCreators from '../../reducers/bookSearch/actionCreators';
import * as subjectsActionCreators from '../../reducers/subjects/actionCreators';
import * as booksSubjectModificationActionCreators from '../../reducers/booksSubjectModification/actionCreators';
import * as uiActionCreators from '../../reducers/ui/actionCreators';
import { globalHashManager } from 'reactStartup';

import GenericLabelSelect from 'applicationRoot/rootComponents/GenericLabelSelect'

const InputForPending = props => {
    let name = props.name,
        actionName = `setPending${name[0].toUpperCase()}${name.slice(1)}`,
        parentProps = props.parentProps;
    return <input { ...props } className="form-control" onKeyDown={parentProps[actionName]} onChange={parentProps[actionName]} value={parentProps.pending[name]} />;
}

class BooksMenuBar extends React.Component {
    constructor(props) {
        super();

        this.state = { menuOpen: false };
        this._hashChangeSubscription = props.syncFiltersToHash;
        window.addEventListener("hashchange", this._hashChangeSubscription);
    }
    removeFilterSubject(_id){
        let isLastSubject = this.props.selectedSubjects.length === 1;
        this.props.removeFilterSubject(_id);

        if (isLastSubject){
            setTimeout(() => this.setState({ menuOpen: false }), 1);
        }
    }
    componentDidMount(){
        this.props.syncFiltersToHash();
    }
    componentWillUnmount(){
        window.removeEventListener("hashchange", this._hashChangeSubscription);
    }
    closeFullFilterModal(){
        this.setState({ fullFiltersOpen: false });
    }
    dropdownToggle(newValue){
        if (this._forceOpen){
            this.setState({ menuOpen: true });
            this._forceOpen = false;
        } else {
            this.setState({ menuOpen: newValue });
        }
    }
    menuItemClickedThatShouldntCloseDropdown(){
        this._forceOpen = true;
    }
    render(){
        let selectedSubjectsCount = this.props.selectedSubjects.length,
            selectedSubjectsHeader = 'Searching ' + selectedSubjectsCount + ' Subject' + (selectedSubjectsCount === 1 ? '' : 's');

        return (
            <div>
                <Navbar style={{ border: 0, borderRadius: 0 }} fluid={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a style={{ cursor: 'default' }}>Your books</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem onClick={this.props.enableSubjectModificationToggledBooks} disabled={!this.props.selectedBooksCount || this.props.viewingPublic}>Set subjects</NavItem>
                            <NavItem onClick={this.props.editSubjects} disabled={this.props.viewingPublic}>Edit subjects</NavItem>
                        </Nav>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a style={{ cursor: 'default' }}>Filters</a>
                            </Navbar.Brand>
                        </Navbar.Header>
                        <Navbar.Form pullLeft>
                            <div className="form-group" style={{ marginRight: '5px' }}>
                                <div className="input-group">
                                    <span className="input-group-btn">
                                        <BootstrapButton preset="default" onClick={this.props.beginFilterChange}>Search</BootstrapButton>
                                    </span>
                                    <InputForPending name="search" parentProps={this.props} placeholder="Quick title search" />
                                </div>
                            </div>

                            <div className="btn-group" role="group">
                                <button type="button" onClick={this.props.setDesktop} className={'btn btn-default ' + (this.props.isDesktop ? 'active' : '')}><i className="fa fa-fw fa-table"></i></button>
                                <button type="button" onClick={this.props.setMobile} className={'btn btn-default ' + (this.props.isMobile ? 'active' : '')}><i className="fa fa-fw fa-list"></i></button>
                                { 0 ? <button type="button" className="btn btn-default"><i className="fa fa-fw fa-th"></i></button> : null }
                            </div>

                        </Navbar.Form>
                        { selectedSubjectsCount ?
                            <Nav>
                                <NavDropdown open={this.state.menuOpen} onToggle={val => this.dropdownToggle(val)} title={selectedSubjectsHeader} id="sel-subjects-dropdown">
                                    { this.props.selectedSubjects.map(s =>
                                        <MenuItem onClick={() => this.menuItemClickedThatShouldntCloseDropdown()} className="default-cursor no-hover" key={s._id}>
                                            <span className="label label-default"><span onClick={() => this.removeFilterSubject(s._id)} style={{ cursor: 'pointer' }}>X</span><span style={{ marginLeft: 5, paddingLeft: 5, borderLeft: '1px solid white' }}>{s.name}</span></span>
                                        </MenuItem>)
                                    }

                                    { !!this.props.searchChildSubjects ? <MenuItem divider /> : null }
                                    { !!this.props.searchChildSubjects ?
                                        <MenuItem onClick={() => this.menuItemClickedThatShouldntCloseDropdown()} className="default-cursor no-hover">
                                            <span className="label label-primary">Searching child subjects</span>
                                        </MenuItem> : null
                                    }
                                </NavDropdown>
                            </Nav> : null
                        }
                    </Navbar.Collapse>
                </Navbar>

                <Modal show={this.props.editingFilters} onHide={this.props.endFilterChanging}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Full search
                        </Modal.Title>
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
                            </div>
                        </form>

                        <div className="row" style={{ position: 'relative' }}>
                            <div className="col-xs-3">
                                <GenericLabelSelect
                                    inputProps={{ placeholder: 'Tags', value: this.props.searchTagsValue, onChange: this.props.setSearchSubjectsValue }}
                                    suggestions={this.props.eligibleFilterTags}
                                    onSuggestionSelected={this.props.addPendingTag} />
                            </div>
                            <div className="col-xs-9">
                                <div>
                                    {this.props.pendingSelectedTags.map(t =>
                                        <span className="label label-default margin-left" style={{ backgroundColor: t.backgroundColor, color: t.textColor || 'white', display: 'inline-table' }}>
                                            <a onClick={() => this.props.removePendingTag(t._id)} style={{ color: t.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{t.name}
                                        </span>)}
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
                                        <span className="label label-default margin-left" style={{ backgroundColor: s.backgroundColor, color: s.textColor || 'white', display: 'inline-table' }}>
                                            <a onClick={() => this.props.removePendingSubject(s._id)} style={{ color: s.textColor || 'white', paddingRight: '5px', marginRight: '5px' }}>X</a>{s.name}
                                        </span>)}
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

const BooksMenuBarConnected = connect(bookSearchSelector, { ...bookSearchActionCreators, ...booksActionCreators, ...subjectsActionCreators, ...booksSubjectModificationActionCreators, ...uiActionCreators })(BooksMenuBar);

export default BooksMenuBarConnected;