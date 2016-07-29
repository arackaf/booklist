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
                <br /><br /><br />
                <BookViewListDesktop store={BookStore} />
            </div>
        );
    }
}

export default BookViewingList;