let BookEntryItem = require('./bookEntryItem');

class BookEntryList extends React.Component {
    componentDidMount(){
        this.props.dispatch({ type: 'INITIALIZE_ENTRY_LIST', count: 10 });
    }
    render() {
        return (
            <div>
                { this.props.entryList.map((entry, i) =>
                        <div key={'Book' + i}>
                            <BookEntryItem
                                isbn={entry.isbn}
                                isbnChange={e => this.isbnChanged(entry, e)}
                                entryFinished={() => this.entryFinished(entry)}
                                index={i}
                                activeInput={this.props.activeInput}
                            />
                            <br /><br />
                        </div>
                )}
            </div>
        );
    }
    isbnChanged(entry, e){
        this.props.dispatch({ type: 'UPDATE_ISBN', isbn: e.target.value, entry });
    }
    entryFinished(entry){
        this.props.dispatch({ type: 'CURRENT_INPUT_FINISHED', entry });
    }

}

module.exports = BookEntryList;

/*

 } else if (action.type === 'UPDATE_ISBN'){
 let objectToUpdate = Object.assign({}, state.entryList[action.index], { isbn: action.isbn }),
 newEntryList = state.entryList.concat();

 newEntryList[action.index] = objectToUpdate;
 return Object.assign({}, state, { entryList: newEntryList });
 }

* */