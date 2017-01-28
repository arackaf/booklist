import React, {Component} from 'react';
import {connect} from 'react-redux';

import {NavBar} from 'simple-react-bootstrap';

import {goHome, globalHashManager} from 'reactStartup';

@connect(state => state.app)
export default class MainNavigationBar extends React.Component {
    logout = () => ajaxUtil.post('/react-redux/logout', { }, () => window.location.reload());
    render(){
        let { isPublic, publicBooksHeader, module, isLoggedIn }  = this.props,
            isBookEntry = module == 'scan',
            isBookList = module == 'books',
            isSubjects = module == 'subjects',
            isLoginModule = module == 'authenticate';

        return (
            <NavBar style={{ borderRadius: 0, borderRight: 0, borderLeft: 0, borderTop: 0 }}>
                <NavBar.Header>
                    <NavBar.Brand>
                        <a className="navbar-brand" onClick={goHome} style={{ cursor: 'pointer' }}>
                            <img height="32" width="32" style={{display: 'inline-block',  marginTop: '-5px'}} src="static/main-icon2.png" />
                            <span style={{display: 'inline-block', verticalAlign: 'top', marginLeft: '5px'}}>My Library</span>
                        </a>
                    </NavBar.Brand>
                    <NavBar.Toggle />
                </NavBar.Header>
                <NavBar.Nav>
                    {isLoggedIn || isPublic ? <NavBar.Item disabled={isPublic} active={isBookEntry} href={isBookEntry ? undefined : '#scan'}>Book entry</NavBar.Item> : null}
                    {isLoggedIn || isPublic ? <NavBar.Item active={isBookList} href={isBookList ? undefined : '#books'}>{isPublic ? publicBooksHeader : 'Books'}</NavBar.Item> : null}
                    {isLoggedIn || isPublic ? <NavBar.Item disabled={isPublic} active={isSubjects} href={isSubjects ? undefined : '#subjects'}>{'Subjects'}</NavBar.Item> : null}
                    {isLoggedIn && isPublic ? <NavBar.Item href="#books">View your collection</NavBar.Item> : null}
                    {isLoggedIn ? <NavBar.Item onClick={this.logout}>Logout</NavBar.Item> : null}
                    {!isLoggedIn && !isLoginModule ? <NavBar.Item href='#login'>Login</NavBar.Item> : null}
                </NavBar.Nav>
            </NavBar>
        );
    }
}