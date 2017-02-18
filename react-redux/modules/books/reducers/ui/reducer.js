'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

var _actionNames = require('./actionNames');

var initialState = {
    isDesktop: false,
    isMobile: false,
    desktopRequested: false,
    mobileRequested: false
};

function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case _actionNames.SET_DESKTOP:
            return _extends({}, initialState, { isDesktop: true });
        case _actionNames.SET_MOBILE:
            return _extends({}, initialState, { isMobile: true });
        case _actionNames.REQUEST_DESKTOP:
            return _extends({}, state, { desktopRequested: true, mobileRequested: false });
        case _actionNames.REQUEST_MOBILE:
            return _extends({}, state, { desktopRequested: false, mobileRequested: true });
    }
    return state;
}