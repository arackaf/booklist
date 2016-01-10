const Modal = ReactBootstrap.Modal;
const HierarchicalSelectableSubjectList = require('./hierarchicalSelectableSubjectList');

const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const hashUtil = require('/utils/hashManager');

class BookSearchDesktop extends React.Component {
    constructor(props) {
        super();
        this.hashManager = new hashUtil();

        this.state = { textSearch: this.hashManager.getCurrentHashValueOf('bookSearch') || '' };
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
        this.setState({ subjectFiltersModalOpen: true });
    }
    closeSubjectsFilterModal(){
        this.props.cancelPendingFilteredSubjects();
        this.setState({ subjectFiltersModalOpen: false });
    }
    applySubjectsFilters(){
        this.setState({ subjectFiltersModalOpen: false });
        this.props.applyPendingFilteredSubjects();
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
                        <HierarchicalSelectableSubjectList
                            toggleFilteredSubject={this.props.toggleFilteredSubject}
                            subjects={this.props.allSubjects}
                            selectedSubjects={this.props.searchFilters.pendingSubjects} />
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