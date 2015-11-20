const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const AjaxButton = require('/react-redux/applicationRoot/rootComponents/ajaxButton');

class BookEntryItem extends React.Component{
    constructor(){
        super();
        this.state = { expanded: false };
    }
    expand(){
        this.setState({ expanded: true });
    }
    collapse(){
        this.setState({ expanded: false });
    }
    render(){
        return (
            <span>
                Input ISBN<input ref='input' value={this.props.isbn} onChange={this.props.isbnChange} onKeyDown={evt => this.keyDown(evt)} disabled={this.props.retrieving}  />
                { this.props.retrieving ? <span>loading....</span> : null }
                { this.props.fetchedTitle ?
                    <span>Saved: { this.props.fetchedTitle }&nbsp;
                        <AjaxButton preset='danger-xs' running={this.props.deleting} onClick={this.props.deleteBook} text='Delete' runningText='Deleting' />&nbsp;
                        <BootstrapButton preset='info-xs' onClick={() => this.expand()}>D</BootstrapButton>
                    </span> : null }
                { this.props.retrieveFailure && !this.props.retrieving ? <span>Could not find isbn: { this.props.fetchedIsbn }</span> : null }
                { this.state.expanded ? <div>Blah blah blah<br />Blah blah blah<br />Blah blah blah <br/><button onClick={() => this.collapse()}>U</button></div> : null }
            </span>
        );
    }
    focusInput(){
        ReactDOM.findDOMNode(this.refs.input).focus();
    }
    keyDown(evt){
        if (evt.keyCode == 13){
            this.props.entryFinished();
        }
    }
}

module.exports = BookEntryItem;