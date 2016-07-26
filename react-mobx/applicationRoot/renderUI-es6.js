import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

export function clearUI(){
    render(
        <div></div>,
        document.getElementById('home')
    );
}

export function renderUI(component){
    render(
        <div>
            { component }
        </div>,
        document.getElementById('home')
    );
}
