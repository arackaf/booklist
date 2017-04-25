import React, { Component } from 'react';

interface B {
    a: string,
    b: string,
    c: number,
    d: number
}

export const XXXXXXXXXXXXXXXXXXXXXXXXXXXXX : B = {
    a: '',
    b: '',
    c: 1,
    d: 1
}

const cssPresets = { };
const buttonTypes = ['default', 'primary', 'success', 'info', 'warning', 'danger'];
const buttonSizes = ['lg', 'sm', 'xs'];

buttonTypes.forEach(t => {
    cssPresets[t] = `btn-${t}`; //default size
    buttonSizes.forEach(s => {
        cssPresets[`${t}-${s}`] = `btn-${t} btn-${s}`;
    });
});

const cssFromPreset = props => (props.className || '') + ' btn ' + (cssPresets[props.preset] || props.css || '');

export default props => (
    <button className={cssFromPreset(props)} style={{ ...props.style }} onClick={props.onClick} disabled={props.disabled}>{props.children}</button>
)


export const BootstrapAnchorButton = props => (
    <a className={cssFromPreset(props)} style={{ ...props.style }} onClick={props.onClick} disabled={props.disabled}>{props.children}</a>);

export const AjaxButton = props => (
    props.running
        ? <button className={cssFromPreset(props)} disabled={true}><i className="fa fa-fw fa-spin fa-spinner"></i>{ (props.runningText || props.text) ? ' ' + props.runningText || props.text : props.children}</button>
        : <button className={cssFromPreset(props)} disabled={props.disabled || false} onClick={props.onClick}>{props.children}</button>)

export const AjaxButtonAnchor = props => (
    props.running
        ? <a className={cssFromPreset(props)} disabled={true}><i className="fa fa-fw fa-spin fa-spinner"></i>{ (props.runningText || props.text) ? ' ' + props.runningText || props.text : props.children}</a>
        : <a className={cssFromPreset(props)} disabled={props.disabled || false} onClick={props.onClick}>{ props.children }</a>)