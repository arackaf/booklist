import React, { Component } from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import UserSettings from './userSettings/main';

export default class UserSettingsMain extends Component {
    state = {currentTab: 'userSettings'};
    setTab = tab => this.setState({currentTab: tab});
    render() {
        return (
            <div style={{ margin: '10px', padding: '10px' }}>
                <ul className="nav nav-tabs">
                    <li className={classNames({active: this.state.currentTab == 'userSettings'})}>
                        <a onClick={() => this.setTab('userSettings')}>Account info</a>
                    </li>
                    <li className={classNames({active: this.state.currentTab == 'scanHistory'})}>
                        <a onClick={() => this.setTab('scanHistory')}>Scan history</a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div style={{ minHeight: '150px' }} className={classNames('tab-pane', {'active in': this.state.currentTab == 'userSettings'})}>
                        <UserSettings />
                    </div>
                    <div style={{ minHeight: '150px' }} className={classNames('tab-pane', {'active in': this.state.currentTab == 'scanHistory'})}>
                        <h1>Scan History</h1>
                    </div>                    
                </div>
            </div>
        );
    }
}