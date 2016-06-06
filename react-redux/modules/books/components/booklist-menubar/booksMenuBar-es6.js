const Modal = ReactBootstrap.Modal;
const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;
const NavDropdown = ReactBootstrap.NavDropdown;
const DropDownButton = ReactBootstrap.DropDownButton;
const MenuItem = ReactBootstrap.MenuItem;
const HierarchicalSelectableSubjectList = require('./hierarchicalSelectableSubjectList');

const BootstrapButton = require('root-components/bootstrapButton');

const { bookSearchSelector } = require('modules/books/reducers/bookSearch/reducer');

import * as bookSearchActionCreators from '../../reducers/bookSearch/actionCreators';
import * as mainActionCreatorsTEMP from '../../reducers/actionCreators';
import { globalHashManager } from 'react-startup';

const InputForPending = props => {
    let name = props.name,
        actionName = `setPending${name[0].toUpperCase()}${name.slice(1)}`,
        parentProps = props.parentProps;
    delete props.name;
    delete props.parentProps;
    return <input { ...props } className="form-control" onKeyDown={parentProps[actionName]} onChange={parentProps[actionName]} value={parentProps.pending[name]} />;
}

class BooksMenuBar extends React.Component {
    constructor(props) {
        super();

        this.state = { pendingSubjects: {}, menuOpen: false };
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
    openFullFilterModal(){
        this.setState({ fullFiltersOpen: true, pendingSubjects: this.props.subjects, searchChildSubjects: this.props.searchChildSubjects });
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
                            <NavItem onClick={this.props.enableSubjectModificationToggledBooks} disabled={!this.props.selectedBooksCount}>Set subjects</NavItem>
                            <NavItem onClick={this.props.editSubjects}>Edit subjects</NavItem>
                        </Nav>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a style={{ cursor: 'default' }}>Filters</a>
                            </Navbar.Brand>
                        </Navbar.Header>
                        <Navbar.Form pullLeft>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-btn">
                                        <BootstrapButton preset="default" onClick={this.props.beginFilterChange}>By subject</BootstrapButton>
                                    </span>
                                    <input className="form-control" placeholder="Quick title search" onKeyDown={this.props.setPendingSearchText} onChange={this.props.setPendingSearchText} value={this.props.pending.searchText} />
                                    <span className="input-group-btn">
                                        <button className="btn btn-default" onClick={() => this.setSearchText()} type="button"><i className="fa fa-search"></i></button>
                                        <button className="btn btn-default" onClick={() => this.openFullFilterModal()} type="button">Full search pane</button>
                                    </span>
                                </div>
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
                                        <InputForPending name="searchText" parentProps={this.props} placeholder="Search title" />
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

                        <label>Also search child subjects <input type="checkbox" onChange={this.props.setPendingSearchChildSubjects} checked={this.props.pending.searchChildSubjects} /></label>
                        <HierarchicalSelectableSubjectList
                            style={{ paddingLeft: 5 }}
                            toggleFilteredSubject={this.props.togglePendingSubject}
                            subjects={this.props.allSubjects}
                            selectedSubjects={this.props.pending.subjects} />

                        { this.props.selectedSubjects.length ? <span>Selected subjects: {this.props.selectedSubjects.map(s => s.name).join(', ')}</span> : null }
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

const BooksMenuBarConnected = ReactRedux.connect(state => bookSearchSelector(state.books), { ...bookSearchActionCreators, ...mainActionCreatorsTEMP })(BooksMenuBar);

export default BooksMenuBarConnected;