import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Navbar,
    Nav,
    NavItem
} from 'react-bootstrap';

import { goHome, globalHashManager } from 'reactStartup';

const NonPublicMainNavigationBar = props => {
    let logout = () => ajaxUtil.post('/react-redux/logout', { }, () => window.location.reload());

    let isBookEntry = props.isBookEntry,
        isBookList = props.isBookList;

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
                    <NavItem active={isBookEntry} href={isBookEntry ? undefined : '#scan'}>Book entry</NavItem>
                    <NavItem active={isBookList} href={isBookList ? undefined : '#books'}>Your books</NavItem>
                    <NavItem onClick={logout}>Logout</NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

const PublicViewingMainNavBar = props => {
    let isBookList = props.isBookList;

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
                    <NavItem disabled={true}>Book entry</NavItem>
                    <NavItem active={true} href={isBookList ? undefined : '#books'}>XXX</NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
const ConnectedPublicViewingNav = connect(state => state.root)(PublicViewingMainNavBar);


class MainNavigationBar extends React.Component {
    render(){
        return (
            this.props.isPublic ? <ConnectedPublicViewingNav { ...this.props } /> : <NonPublicMainNavigationBar { ...this.props } />
        )
    }
}
const MainNavigationBarConnected = connect(state => state.root)(MainNavigationBar);
export default MainNavigationBarConnected;
