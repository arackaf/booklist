const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const hashUtil = require('/utils/hashManager');

class BookSearchDesktop extends React.Component {
    constructor() {
        super();
        this.hashManager = new hashUtil();

        let hashObj = this.hashManager.getCurrentHashInfo();
        this.state = {textSearch: hashObj.parameters.bookSearch || ''};
    }
    render(){
        return (
            <div>
                <BootstrapButton preset="primary-sm" onClick={this.props.openSubjectsFilterModal}>Edit subjects</BootstrapButton>
                <input onKeyDown={evt => this.keyDown(evt)} onChange={evt => this.setState({ textSearch: evt.target.value })} value={this.state.textSearch} />
            </div>
        )
    }
    keyDown(evt){
        if (evt.which == 13){
            this.hashManager.setValueOf('bookSearch', this.state.textSearch);
        }
    }
}

module.exports = BookSearchDesktop;