let BookEntryItem = require('./bookEntryItem');

class BookEntryList extends React.Component {
    componentDidMount(){
        console.log('MOUNTED');
        this.props.dispatch({ type: 'INITIALIZE_ENTRY_LIST', count: 10 })
    }
    render() {
        return (
            <div>
                <div>Hello World from { this.props.from }</div>
                <br />
                <div>
                    { this.props.entryList.map((obj, i) =>
                            <div key={'Book' + i}>
                                <BookEntryItem isbn={obj.isbn} isbnChange={e => this.isbnChanged(obj, e)} />
                                <br /><br />
                            </div>
                    )}
                </div>
            </div>
        )
    }
    isbnChanged(entry, e){
        this.props.dispatch({ type: 'UPDATE_ISBN', isbn: e.target.value, entry });
        console.log('changed', entry.isbn, e.target.value);
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