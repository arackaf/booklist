const Modal = ReactBootstrap.Modal;
const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;
const NavDropdown = ReactBootstrap.NavDropdown;
const DropDownButton = ReactBootstrap.DropDownButton;
const MenuItem = ReactBootstrap.MenuItem;
const HierarchicalSelectableSubjectList = require('./hierarchicalSelectableSubjectList');

const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const hashUtil = require('/utils/hashManager');

const { bookSearchSelector } = require('../reducers/bookSearchReducer');

import * as bookSearchActionCreators from '../actions/bookSearch/actionCreators';

class BookFilters extends React.Component {
    constructor(props) {
        super();
        this.togglePendingSubject = this.togglePendingSubject.bind(this);
        this.hashManager = new hashUtil();

        this.state = { pendingSubjects: {}, menuOpen: false };
        this._hashChangeSubscription = () => {
            props.setSearchFilterText(this.hashManager.getCurrentHashValueOf('bookSearch') || '');
            let subjectsSelected = {},
                selectedSubjectsHashString = this.hashManager.getCurrentHashValueOf('filterSubjects');
            if (selectedSubjectsHashString){
                selectedSubjectsHashString.split('-').forEach(_id => subjectsSelected[_id] = true);
            }

            props.setFilteredSubjects(subjectsSelected, this.hashManager.getCurrentHashValueOf('searchChildSubjects') ? 'true' : null);
        };
        window.addEventListener("hashchange", this._hashChangeSubscription);
    }
    removeFilterSubject(_id){
        let selectedSubjectsHashString = this.hashManager.getCurrentHashValueOf('filterSubjects'),
            subjectsArr = selectedSubjectsHashString.split('-');
        subjectsArr = subjectsArr.filter(sId => sId != _id);

        this.hashManager.setValueOf('filterSubjects', subjectsArr.join('-'));
        if (!subjectsArr.length){
            setTimeout(() => this.setState({ menuOpen: false }), 1);
        }
    }
    componentDidMount(){
        this.props.setSearchFilterText(this.hashManager.getCurrentHashValueOf('bookSearch') || '');
        this._hashChangeSubscription();
    }
    componentWillReceiveProps(newProps){
        if (this.props.searchText !== newProps.searchText) {
            this.refs.searchInput.value = newProps.searchText;
        }
    }
    componentWillUnmount(){
        window.removeEventListener("hashchange", this._hashChangeSubscription);
    }
    openSubjectsFilterModal(){
        this.setState({ subjectFiltersModalOpen: true, pendingSubjects: this.props.subjects, searchChildSubjects: this.props.searchChildSubjects });
    }
    closeSubjectsFilterModal(){
        this.setState({ subjectFiltersModalOpen: false });
    }
    applySubjectsFilters(){
        this.setState({ subjectFiltersModalOpen: false });

        let filterSubjectsVal = Object.keys(this.state.pendingSubjects).filter(k => this.state.pendingSubjects[k]).join('-');
        this.hashManager.setValues(
            'filterSubjects', filterSubjectsVal,
            'searchChildSubjects', this.state.searchChildSubjects && filterSubjectsVal ? 'true' : null
        );
    }
    togglePendingSubject(_id){
        this.setState({ pendingSubjects: { ...this.state.pendingSubjects, [_id]: !this.state.pendingSubjects[_id] } });
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
                <Navbar fluid={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a style={{ cursor: 'default' }}>Search filters</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Navbar.Form pullLeft>
                            <div className="form-group">
                                <BootstrapButton preset="primary-sm" onClick={() => this.openSubjectsFilterModal()}>Filter by subject</BootstrapButton>
                            </div>
                            {' '}
                            <div className="form-group">
                                <input className="form-control" onKeyDown={evt => this.searchFilterKeyDown(evt)} ref="searchInput" />
                            </div>
                        </Navbar.Form>
                        <Nav>
                            {
                            selectedSubjectsCount ?
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
                                </NavDropdown> : null
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Modal show={this.state.subjectFiltersModalOpen} onHide={() => this.closeSubjectsFilterModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Filter subjects
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Also search child subjects <input type="checkbox" onChange={evt => this.setState({ searchChildSubjects: evt.target.checked })} checked={this.state.searchChildSubjects} /></label>
                        <HierarchicalSelectableSubjectList
                            style={{ paddingLeft: 5 }}
                            toggleFilteredSubject={this.togglePendingSubject}
                            subjects={this.props.allSubjects}
                            selectedSubjects={this.state.pendingSubjects} />

                        { this.props.selectedSubjects.length ?
                            <span>Selected subjects: <span>{this.props.selectedSubjects.map(s => s.name).join(', ')}</span></span>
                            : null }
                    </Modal.Body>
                    <Modal.Footer>
                        <BootstrapButton preset="default" className="pull-left" onClick={() => this.closeSubjectsFilterModal()}>Close</BootstrapButton>
                        <BootstrapButton preset="primary" onClick={() => this.applySubjectsFilters()}>Filter</BootstrapButton>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
    searchFilterKeyDown(evt){
        if (evt.which == 13){
            this.hashManager.setValueOf('bookSearch', evt.target.value);
        }
    }
}

const BookFiltersConnected = ReactRedux.connect(state => bookSearchSelector(state.bookList), { ...bookSearchActionCreators })(BookFilters);

export default BookFiltersConnected;