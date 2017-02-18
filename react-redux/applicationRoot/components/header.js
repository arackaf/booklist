import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { store } from '../store';

function projectState(state){
    return state;
}

class Header extends Component {
    render() {
        return (
            <div>{ this.props.app.module }</div>
        );
    }
}

Header = connect(projectState)(Header);

export default Header;