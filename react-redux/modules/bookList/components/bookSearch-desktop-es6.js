const hashUtil = require('/utils/hashManager');

class BookSearchDesktop extends React.Component {
    constructor() {
        super();
        this.hashManager = new hashUtil();
        this.state = {textSearch: ''};
    }
    render(){
        return (
            <div>
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