const AjaxButton = require('/react-redux/applicationRoot/rootComponents/ajaxButton');

class BookEntryItem extends React.Component{
    render(){
        return (
            <span>
                Input ISBN<input ref='input' value={this.props.isbn} onChange={this.props.isbnChange} onKeyDown={evt => this.keyDown(evt)} disabled={this.props.retrieving}  />
                { this.props.retrieving ? <span>loading....</span> : null }
                { this.props.fetchedTitle ? <span>Saved: { this.props.fetchedTitle } <AjaxButton running={this.props.deleting} onClick={this.props.deleteBook} text={'Delete'} runningText='Deleting' /></span> : null }
                { this.props.retrieveFailure ? <span>Could not find isbn: { this.props.isbn }</span> : null }
            </span>
        );
    }
    componentDidMount(){
        if (this.props.index == 0){
            ReactDOM.findDOMNode(this.refs.input).focus();
        }
    }
    componentDidUpdate(){
        if (this.props.index == this.props.activeInput){
            ReactDOM.findDOMNode(this.refs.input).focus();
        }
    }
    keyDown(evt){
        if (evt.keyCode == 13){
            this.props.entryFinished();
        }
    }
}

module.exports = BookEntryItem;