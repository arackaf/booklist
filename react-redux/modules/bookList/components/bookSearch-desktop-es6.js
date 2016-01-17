const Modal = ReactBootstrap.Modal;
const HierarchicalSelectableSubjectList = require('./hierarchicalSelectableSubjectList');

const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const hashUtil = require('/utils/hashManager');

class BookSearchDesktop extends React.Component {
    constructor(props) {
        super();
        this.togglePendingSubject = this.togglePendingSubject.bind(this);
        this.hashManager = new hashUtil();

        this.state = { textSearch: this.hashManager.getCurrentHashValueOf('bookSearch') || '', pendingSubjects: {} };
        this._hashChangeSubscription = () => props.setSearchText(this.hashManager.getCurrentHashValueOf('bookSearch') || '');
        window.addEventListener("hashchange", this._hashChangeSubscription);
    }
    componentDidMount(){
        this.props.setSearchText(this.state.textSearch);
    }
    componentWillReceiveProps(newProps){
        if (this.props.searchFilters.searchText !== newProps.searchFilters.searchText) {
            this.setState({ textSearch: newProps.searchFilters.searchText });
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
        this.props.setFilteredSubjects(this.state.pendingSubjects);
    }
    togglePendingSubject(_id){
        this.setState({ pendingSubjects: { ...this.state.pendingSubjects, [_id]: !this.state.pendingSubjects[_id] } });
    }
    render(){
        return (
            <div>
                <BootstrapButton preset="primary-sm" onClick={() => this.openSubjectsFilterModal()}>Filter by subject</BootstrapButton>&nbsp;
                <input onKeyDown={evt => this.keyDown(evt)} onChange={evt => this.searchFilterTyped(evt)} value={this.state.textSearch} />
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
    keyDown(evt){
        if (evt.which == 13){
            this.hashManager.setValueOf('bookSearch', this.state.textSearch);
        }
    }
    searchFilterTyped(evt){
        this.setState({ textSearch: evt.target.value });
    }
}

module.exports = BookSearchDesktop;