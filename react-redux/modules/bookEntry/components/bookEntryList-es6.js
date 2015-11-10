let BookEntryItem = require('./bookEntryItem'),
    { updateIsbn, currentInputFinished, initializeEntryList, getBook, getBookResults, loadAndSaveBook, deleteBook } = require('../actions/bookActionCreators');

class BookEntryList extends React.Component {
    componentDidMount(){
        this.props.dispatch(initializeEntryList(10));
    }
    render() {
        return (
            <div>
                { this.props.entryList.map((entry, i) =>
                        <div key={'Book' + i}>
                            <BookEntryItem
                                { ...entry }
                                isbnChange={e => this.isbnChanged(entry, e)}
                                entryFinished={() => this.entryFinished(entry)}
                                index={i}
                                activeInput={this.props.activeInput}
                                deleteBook={() => this.deleteBook(entry)}
                            />
                            <br /><br />
                        </div>
                )}
                <button onClick={() => this.saveAll()}>Retrieve and save all</button>
                <br />
                <br />
            </div>
        );
    }
    saveAll(){
        console.log('clicked');
    }
    deleteBook(entry){
        this.props.dispatch(deleteBook(this.props.entryList.indexOf(entry), entry.fetchedInfo._id));
    }
    isbnChanged(entry, e){
        this.props.dispatch(updateIsbn(e.target.value, entry));
    }
    entryFinished(entry){
        let index = this.props.entryList.indexOf(entry);

        this.props.dispatch(currentInputFinished(index));

        if (entry.isbn.length == 10 || entry.isbn.length == 13){
            this.props.dispatch(loadAndSaveBook(index, entry.isbn));
        }
    }
}

module.exports = BookEntryList;