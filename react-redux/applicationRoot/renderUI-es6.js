import React from 'react';
import { Provider, connect } from 'react-redux';
import Header from './components/header';
import { store } from './store';
import { render } from 'react-dom';
import {requestDesktop, requestMobile} from './rootReducerActionCreators';
import MainNavigationBar from 'applicationRoot/components/mainNavigation';

const MobileMeta = connect(state => state.app, {})(app =>
    <meta name="viewport" content={app.showingMobile ? "width=device-width, minimum-scale=1.0, maximum-scale=3.0; user-scalable=1;" : ''} />
);

const WellUiSwitcher = connect(state => state.app, {requestDesktop, requestMobile})(props => {
    let showChooseDesktop = props.isMobile && props.showingMobile,
        showSwitchBackMobile = props.isMobile && props.showingDesktop;

    return (
        <div className="well well-sm">
            <img width="16" height="16" src="/static/main-icon.png"/>
            <span style={{marginLeft: '5px', marginRight: '5px'}}>Track my books</span>
            { showChooseDesktop ? <a onClick={props.requestDesktop}>Use desktop version</a> : null }
            { showSwitchBackMobile ? <a onClick={props.requestMobile}>Use mobile version</a> : null }
        </div>
    );
});


export function clearUI(){
    render(
        <div></div>,
        document.getElementById('home')
    );
}

export function renderUI(component){
    render(
        <Provider store={store}>
            <div>
                <MobileMeta />
                <MainNavigationBar />
                { component }
                <WellUiSwitcher />
            </div>
        </Provider>,
        document.getElementById('home')
    );
}
