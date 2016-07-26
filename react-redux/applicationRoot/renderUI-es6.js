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
    render(
        <Provider store={store}>
            <div>
                { component }
            </div>
        </Provider>,
        document.getElementById('home')
    );
}
