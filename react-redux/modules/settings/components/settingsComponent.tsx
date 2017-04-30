import React, { Component } from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import PublicUserSettings from './publicUserSettings/main';
import PasswordReset from './passwordReset/main';

export default class PublicUserSettingsMain extends Component<any, any> {
    state = {currentTab: 'publicSettings'};
    setTab = tab => this.setState({currentTab: tab});
    render() {
        let PUS : any = PublicUserSettings;
        let PR : any = PasswordReset;
        return (
            <div style={{ margin: '10px', padding: '10px' }}>
                <ul className="nav nav-tabs">
                    <li className={classNames({active: this.state.currentTab == 'publicSettings'})}>
                        <a onClick={() => this.setTab('publicSettings')}>Public settings</a>
                    </li>
                    <li className={classNames({active: this.state.currentTab == 'passwordReset'})}>
                        <a onClick={() => this.setTab('passwordReset')}>Reset password</a>
                    </li>
                    <li className={classNames({active: this.state.currentTab == 'scanHistory'})}>
                        <a onClick={() => this.setTab('scanHistory')}>Scan history</a>
                    </li>
                </ul>
                <div className="tab-content">
                    <div style={{ minHeight: '150px' }} className={classNames('tab-pane', {'active in': this.state.currentTab == 'publicSettings'})}>
                        <PUS />
                    </div>
                    <div style={{ minHeight: '150px' }} className={classNames('tab-pane', {'active in': this.state.currentTab == 'passwordReset'})}>
                        <PR />
                    </div>
                    <div style={{ minHeight: '150px' }} className={classNames('tab-pane', {'active in': this.state.currentTab == 'scanHistory'})}>
                        <h1>Coming soon...</h1>
                    </div>                    
                </div>
            </div>
        );
    }
}