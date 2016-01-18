const Modal = ReactBootstrap.Modal;
const HierarchicalSelectableSubjectList = require('./hierarchicalSelectableSubjectList');

const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const hashUtil = require('/utils/hashManager');

class BookSearchDesktop extends React.Component {
    constructor(props) {
        super();
        this.togglePendingSubject = this.togglePendingSubject.bind(this);
        this.hashManager = new hashUtil();

        this.state = { pendingSubjects: {} };
        this._hashChangeSubscription = () => {
            props.setSearchText(this.hashManager.getCurrentHashValueOf('bookSearch') || '');
            let subjectsSelected = {},
                selectedSubjectsHashString = this.hashManager.getCurrentHashValueOf('filterSubjects');
            if (selectedSubjectsHashString){
                selectedSubjectsHashString.split('-').forEach(_id => subjectsSelected[_id] = true);
            }
            props.setFilteredSubjects(subjectsSelected);
        };
        window.addEventListener("hashchange", this._hashChangeSubscription);
    }
    componentWillReceiveProps(newProps){
        if (this.props.searchFilters.searchText !== newProps.searchFilters.searchText) {
            this.refs.searchInput.value = newProps.searchFilters.searchText;
        }
    }
    componentWillUnmount(){
        window.removeEventListener("hashchange", this._hashChangeSubscription);
    }
    openSubjectsFilterModal(){
        this.setState({ subjectFiltersModalOpen: true, pendingSubjects: this.props.searchFilters.subjects });
    }
    closeSubjectsFilterModal(){
        this.setState({ subjectFiltersModalOpen: false });
    }
    applySubjectsFilters(){
        this.setState({ subjectFiltersModalOpen: false });
        this.hashManager.setValueOf('filterSubjects', Object.keys(this.state.pendingSubjects).filter(k => this.state.pendingSubjects[k]).join('-'));
    }
    togglePendingSubject(_id){
        this.setState({ pendingSubjects: { ...this.state.pendingSubjects, [_id]: !this.state.pendingSubjects[_id] } });
    }
    render(){
        return (
            <div>
                <BootstrapButton preset="primary-sm" onClick={() => this.openSubjectsFilterModal()}>Filter by subject</BootstrapButton>&nbsp;
                <input onKeyDown={evt => this.searchFilterKeyDown(evt)} ref="searchInput" />
                <span>{'Current search: ' + this.props.searchFilters.searchText}</span>
                <span title={this.props.searchFilters.selectedSubjects.length}>{this.props.searchFilters.selectedSubjects.length ? `${this.props.searchFilters.selectedSubjects.length} subjects filtered` : null}</span>


                <Modal show={this.state.subjectFiltersModalOpen} onHide={() => this.closeSubjectsFilterModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Filter subjects
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Also search child subjects <input type="checkbox" defaultValue={this.props.searchFilters.searchChildSubjects} /></label>
                        <HierarchicalSelectableSubjectList
                            toggleFilteredSubject={this.togglePendingSubject}
                            subjects={this.props.allSubjects}
                            selectedSubjects={this.state.pendingSubjects} />

                        { this.props.searchFilters.selectedSubjects.length ?
                            <span>Selected subjects: <span>{this.props.searchFilters.selectedSubjects.map(s => s.name).join(', ')}</span></span>
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

module.exports = BookSearchDesktop;