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
    render(){
        return (
            <div>
                <BootstrapButton preset="primary-sm" onClick={this.props.openSubjectsFilterModal}>Filter by subject</BootstrapButton>&nbsp;
                <input onKeyDown={evt => this.keyDown(evt)} onChange={evt => this.searchFilterTyped(evt)} value={this.state.textSearch} />
                <span>{'Current search: ' + this.props.searchFilters.searchText}</span>
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