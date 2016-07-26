import React from 'react';
import BookStore from '../model/bookStore';

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
                {BookStore.books.map(book => <div>{book.title}</div>)}
            </div>
        );
    }
}

export default BookViewingList;