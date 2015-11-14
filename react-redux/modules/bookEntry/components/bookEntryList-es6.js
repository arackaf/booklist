let BookEntryItem = require('./bookEntryItem'),
    { updateIsbn, currentInputFinished, getBook, getBookResults, loadAndSaveBook, deleteBook, saveAllPending, resetList } = require('../actions/bookActionCreators');

class BookEntryList extends React.Component {
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
                <button onClick={() => this.resetList()}>Reset list</button>
            </div>
        );
    }
    saveAll(){
        this.props.dispatch(saveAllPending());
    }
    deleteBook(entry){
        this.props.dispatch(deleteBook(this.props.entryList.indexOf(entry), entry.fetchedInfo._id));
    }
    isbnChanged(entry, e){
        this.props.dispatch(updateIsbn(e.target.value, this.props.entryList.indexOf(entry)));
    }
    entryFinished(entry){
        let index = this.props.entryList.indexOf(entry);

        this.props.dispatch(currentInputFinished(index));

        if (entry.isbn.length == 10 || entry.isbn.length == 13){
            this.props.dispatch(loadAndSaveBook(index, entry.isbn));
        }
    }
    resetList(){
        this.props.dispatch(resetList());
    }
}

module.exports = BookEntryList;