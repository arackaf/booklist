import React from 'react';
import BookStore from '../model/bookModuleStore';
const bookSearch = BookStore.bookSearch;

import BookViewListDesktop from './bookViewList-desktop';
import BookSearch from './bookSearchModal';
import BootstrapButton from 'applicationRoot/components/bootstrapButton';

import { observer } from "mobx-react";

@observer
class SubjectsDisplay extends React.Component{
    render(){
        return (
            <ul>
                {this.props.subjects.map(s =>
                    <li>
                        {s.name}
                        { s.children.length ? <SubjectsDisplay subjects={s.children} /> : null }
                    </li>
                )}
            </ul>
        )
    }
}

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
                        <SubjectsDisplay subjects={BookStore.stackedSubjects} />
                        <br />
                        {BookStore.unwoundSubjects.map(s =>
                            <div>
                                <span className="label label-default" style={{ backgroundColor: s.backgroundColor, color: s.textColor || 'white' }}>{s.name + ' ' + s.childLevel}</span>
                            </div>)}
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