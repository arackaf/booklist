let { } = require('../actions/actionCreators');

const BookViewListItem = require('./bookViewListItem');

class BookEntryList extends React.Component {
    render() {
        return (
            <div>
                Root list -> <br/><br/>

                { Array.from({ length: 10 }).map(o => <BookViewListItem />) }

            </div>
        );
    }
}

module.exports = BookEntryList;