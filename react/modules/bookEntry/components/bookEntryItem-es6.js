class BookEntryItem extends React.Component{
    render(){
        return (
            <span>Input ISBN<input ref='input' value={this.props.isbn} onChange={this.props.isbnChange} onKeyDown={evt => this.keyDown(evt)}  /></span>
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