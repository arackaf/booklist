import React from 'react';
import { isLoggedIn, goHome } from 'reactStartup';
import { render } from 'react-dom';

import {
    Nav,
    Navbar,
    NavItem
} from 'react-bootstrap';

import MainNavigationBar from 'applicationRoot/components/mainNavigation';

import { observable, computed } from 'mobx';
import { observer } from "mobx-react";

class BookList {
    @observable books = []
    @computed get readBooks(){
        return this.books.filter(b => b.isRead);
    }
    loadBooks(){
        setTimeout(() => {
            this.books = [
                { title: 'The Language Instinct', author: 'Steven Pinker', isRead: true },
                { title: 'History of The United States During the Administration of Thomas Jefferson', author: 'Henry Adams', isRead: true },
                { title: 'History of The United States During the Administration of James Madison', author: 'Henry Adams', isRead: false }
            ].map(b => new Book(b));
        }, 50);
    }
}

class Book {
    @observable isRead = false
    constructor(props){
        Object.assign(this, props)
    }
    toggleRead(){
        this.isRead = !this.isRead;
    }
}

@observer
class MobXTest extends React.Component {
    constructor(props){
        super();
        props.bookList.loadBooks();
    }
    render(){
        return (
            <div>
                <span>All books:</span>
                <ul>{ this.props.bookList.books.map(b =>
                    <li>
                        {b.title} <i className={'fa fa-' + (b.isRead ? 'check' : 'cross')}></i>
                        <button className="btn btn-xs btn-primary" onClick={() => b.toggleRead()}>Toggle Read</button>
                    </li>) }
                </ul>

                <br />

                <span>Read books:</span>
                <ul>{ this.props.bookList.readBooks.map(b => <li>{b.title}</li>) }</ul>
            </div>
        );
    }
}

const bookList = new BookList();

render(<MobXTest bookList={bookList} />, document.getElementById('mobx-temp-home'));



const MainHomePane = props =>
    <div className="row">
        <div className="hidden-xs hidden-sm col-md-1 col-lg-3"></div>
        <div style={{ marginLeft: 10, marginRight: 10 }} className="col-md-10 col-lg-6">
            <div className="panel panel-default">
                <div className="panel-body">
                    {props.children}
                </div>
            </div>
        </div>
        <div className="hidden-xs hidden-sm col-md-1 col-lg-3"></div>
    </div>

class HomeIfLoggedIn extends React.Component{
    constructor(){
        super();
        this.state = {};
    }
    render(){
        return (
            <div>
                <MainNavigationBar></MainNavigationBar>
                <MainHomePane>
                    Welcome to <i>My Library</i>.  Eventually there'll be some sort of interesting dashboard here.  Until then, just use the menu above
                    to either view your library, or scan some books in.
                    <br />
                    <br />

                </MainHomePane>
            </div>
        )
    }
}

class HomeIfNotLoggedIn extends React.Component{
    render(){
        return (
            <div>
                <Navbar fluid={true}>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a style={{ cursor: 'default' }}>My Library</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem href='#login'>Login</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <MainHomePane>
                    Welcome to <i>My Library</i>.
                    <br /><br />
                    This site is my own little passion project, the purpose of which is to track your library.  You scan in your books (or manually type in the isbn)
                    and the books' info is fetched from Amazon, and stored for you.  You can then flexibly search and categorize your library.
                    <br /><br />
                    So basically this site is of use to the extremely small percentage of people for whom the following are <i>all</i> true: they read a lot,
                    own the books they read, and read non-eBooks.  As I said, this is more of a passion project than anything.
                    <br /><br />
                    It's free to sign up, and store up to 500 books.  In the remote chance someone actually wants to store more than that, there'll be some sort
                    of nominal fee to help defray storage costs.
                    <br /><br />
                    <a className="btn btn-primary" href="#login">Login or create an account</a>
                </MainHomePane>
            </div>
        )
    }
}

class Home extends React.Component{
    constructor(){
        super();
        this.state = { isLoggedIn: isLoggedIn() };
    }
    render(){
        return (
            <div style={{ paddingLeft: 0, paddingRight: 0 }} className="container-fluid">
                { this.state.isLoggedIn ? <HomeIfLoggedIn /> : <HomeIfNotLoggedIn /> }
            </div>
        );
    }
}

export default Home;