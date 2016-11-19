import React from 'react';
import { Provider, connect } from 'react-redux';
import Header from './components/header';
import { store } from './store';
import { render } from 'react-dom';
import {requestDesktop, requestMobile} from './rootReducerActionCreators';

const MobileMeta = connect(state => state.app, {requestDesktop, requestMobile})(app =>
    app.showingMobile ? <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=3.0; user-scalable=1;" /> : null
);


export function clearUI(){
    render(
        <div></div>,
        document.getElementById('home')
    );
}

export function renderUI(component){
    let state = store.getState(),
        showChooseDesktop = state.app.isMobile && state.app.showingMobile,
        showSwitchBackMobile = state.app.isMobile && state.app.showingDesktop;

    console.log('state.app.showingMobile', state.app.showingMobile)

    render(
        <Provider store={store}>
            <div>
                <MobileMeta />
                { component }

                <div className="well well-sm">
                    <img width="16" height="16" src="/static/main-icon.png" />
                    <span style={{marginLeft: '5px', marginRight: '5px'}}>Track my books</span>
                    { showChooseDesktop ? <a onClick={() => store.dispatch(requestDesktop())}>Use desktop version</a> : null }
                    { showSwitchBackMobile ? <a onClick={() => store.dispatch(requestMobile())}>Use mobile version</a> : null }
                </div>
            </div>
        </Provider>,
        document.getElementById('home')
    );
}
