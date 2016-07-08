'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.globalHashManager = undefined;
exports.loadCurrentModule = loadCurrentModule;
exports.isLoggedIn = isLoggedIn;
exports.goHome = goHome;

var _hashManager = require('util/hashManager');

var _hashManager2 = _interopRequireDefault(_hashManager);

var _renderUI = require('applicationRoot/renderUI');

var _store = require('applicationRoot/store');

var _react = require('react');

require('util/ajaxUtil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let currentModule;

window.onhashchange = function () {
    loadCurrentModule();
};

const validModules = new Set(['books', 'scan', 'home', 'activate']);

loadCurrentModule();
function loadCurrentModule() {
    let hash = window.location.hash.replace('#', ''),
        originalModule = hash.split('/')[0] || '',
        module = (hash.split('/')[0] || 'home').toLowerCase();

    let loggedIn = isLoggedIn();
    if (!loggedIn) {
        if (originalModule && module != 'home') {
            module = 'authenticate';
        } else {
            module = 'home';
        }
    } else {
        if (!validModules.has(module)) {
            window.location.hash = 'books';
            return;
        }
    }

    if (module === currentModule) return;
    currentModule = module;

    System.import(`./modules/${ module }/${ module }`).then(({ default: module }) => {
        (0, _renderUI.clearUI)();
        if (module.reducer) {
            (0, _store.getNewReducer)({ name: module.name, reducer: module.reducer });
        }
        (0, _renderUI.renderUI)((0, _react.createElement)(module.component));
    });
}

const globalHashManager = exports.globalHashManager = new _hashManager2.default();

function isLoggedIn() {
    return (/logged_in/ig.test(document.cookie)
    );
}

function goHome() {
    let currentModule = globalHashManager.getCurrentHashInfo().module || 'home';
    if (currentModule === 'home') return;
    globalHashManager.setHash(new _hashManager.SerializedHash('home'));
}