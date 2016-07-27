import React from 'react';
import BookStore from '../model/bookStore';
import BookViewListDesktop from './bookViewList-desktop';

import { observer } from "mobx-react";

@observer
class BookViewingList extends React.Component {
    constructor(){
        super();
    }
    componentDidMount(){

    }
    render() {
        return (
            <div>
                <h1>{BookStore.books.length}</h1>
                <h1>{BookStore.rawBooks.length}</h1>

                <BookViewListDesktop
                    store={BookStore} />
            </div>
        );
    }
}

export default BookViewingList;