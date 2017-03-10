import React, { Component } from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import PublicUserSettings from './publicUserSettings/main';

export default class PublicUserSettingsMain extends Component {
    state = {currentTab: 'publicSettings'};
    setTab = tab => this.setState({currentTab: tab});
    render() {
        return (
            <div style={{ margin: '10px', padding: '10px' }}>
                <ul className="nav nav-tabs">
                    <li className={classNames({active: this.state.currentTab == 'publicSettings'})}>
                        <a onClick={() => this.setTab('publicSettings')}>Make public</a>
                    </li>
                    <li className={classNames({active: this.state.currentTab == 'scanHistory'})}>
                        <a onClick={() => this.setTab('scanHistory')}>Scan history</a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div style={{ minHeight: '150px' }} className={classNames('tab-pane', {'active in': this.state.currentTab == 'publicSettings'})}>
                        <PublicUserSettings />
                    </div>
                    <div style={{ minHeight: '150px' }} className={classNames('tab-pane', {'active in': this.state.currentTab == 'scanHistory'})}>
                        <h1>Coming...</h1>
                    </div>                    
                </div>
            </div>
        );
    }
}