class BookEntryItem extends React.Component{
    render(){
        return (
            <span>Input ISBN<input value={this.props.isbn} onChange={this.props.isbnChange} /></span>
        );
    }
}

module.exports = BookEntryItem;