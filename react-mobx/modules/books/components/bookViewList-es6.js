import React from 'react';
import BookStore from '../model/bookStore';
const bookSearch = BookStore.bookSearch;

import BookViewListDesktop from './bookViewList-desktop';
import BookSearch from './bookSearchModal';
import BootstrapButton from 'applicationRoot/components/bootstrapButton';

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
                <BootstrapButton preset="primary" onClick={() => bookSearch.beginSearchChange()}>Open</BootstrapButton>
                <br /><br /><br />
                <BookSearch />

                <div className="row">
                    <div className="col-xs-3">
                        Hello
                    </div>
                    <div className="col-xs-9">
                        <BookViewListDesktop store={BookStore} />
                    </div>
                </div>
            </div>
        );
    }
}

export default BookViewingList;