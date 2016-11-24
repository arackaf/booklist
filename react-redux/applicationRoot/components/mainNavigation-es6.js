import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Navbar,
    Nav,
    NavItem
} from 'react-bootstrap';

import { goHome, globalHashManager } from 'reactStartup';

@connect(state => state.app)
export default class MainNavigationBar extends React.Component {
    logout = () => ajaxUtil.post('/react-redux/logout', { }, () => window.location.reload());
    render(){
        let { isPublic, publicBooksHeader, module, isLoggedIn }  = this.props,
            isBookEntry = module == 'scan',
            isBookList = module == 'books',
            isLoginModule = module == 'authenticate';

        return (
            <Navbar style={{ borderRadius: 0, borderRight: 0, borderLeft: 0, borderTop: 0 }} fluid={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a onClick={goHome} style={{ cursor: 'pointer' }}>My Library</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        {isLoggedIn ? <NavItem disabled={isPublic} active={isBookEntry} href={isBookEntry ? undefined : '#scan'}>Book entry</NavItem> : null}
                        {isLoggedIn ? <NavItem active={isBookList} href={isBookList ? undefined : '#books'}>{isPublic ? publicBooksHeader : 'Your books'}</NavItem> : null}
                        {isLoggedIn ? <NavItem onClick={this.logout}>Logout</NavItem> : null}
                        {!isLoggedIn && !isLoginModule ? <NavItem href='#login'>Login</NavItem> : null}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}