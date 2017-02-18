'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setDesktop = setDesktop;
exports.setMobile = setMobile;
exports.requestMobile = requestMobile;
exports.requestDesktop = requestDesktop;

var _actionNames = require('./actionNames');

function setDesktop() {
    return { type: _actionNames.SET_DESKTOP };
}

function setMobile() {
    return { type: _actionNames.SET_MOBILE };
}

function requestMobile() {
    return { type: _actionNames.REQUEST_MOBILE };
}

function requestDesktop() {

    //TODO: pending proper thunk refactor
    //let viewport = document.querySelector("meta[name=viewport]");
    //viewport.setAttribute('content', '');

    return { type: _actionNames.REQUEST_DESKTOP };
}