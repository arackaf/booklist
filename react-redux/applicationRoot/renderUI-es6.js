import React from 'react';
import { Provider } from 'react-redux';
import Header from './components/header';
import { store } from './store';
import { render } from 'react-dom';

export function clearUI(){
    render(
        <div></div>,
        document.getElementById('home')
    );
}

export function renderUI(component){
    let state = store.getState();
    render(
        <Provider store={store}>
            <div>
                { state.app.showingMobile ? <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=3.0; user-scalable=1;" /> : null }
                { component }
            </div>
        </Provider>,
        document.getElementById('home')
    );
}
