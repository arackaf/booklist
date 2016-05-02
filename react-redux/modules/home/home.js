'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactStartup = require('react-startup');

var _reactStartup2 = _interopRequireDefault(_reactStartup);

var _rootComponentsMainNavigation = require('root-components/mainNavigation');

var _rootComponentsMainNavigation2 = _interopRequireDefault(_rootComponentsMainNavigation);

var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;

var HomeIfLoggedIn = (function (_React$Component) {
    _inherits(HomeIfLoggedIn, _React$Component);

    function HomeIfLoggedIn() {
        _classCallCheck(this, HomeIfLoggedIn);

        _get(Object.getPrototypeOf(HomeIfLoggedIn.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HomeIfLoggedIn, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(_rootComponentsMainNavigation2['default'], null),
                React.createElement(
                    'div',
                    null,
                    'You\'re logged in.  Use the menu ago to go somewhere useful.  Eventually there\'ll be some sort of dashboard here.'
                )
            );
        }
    }]);

    return HomeIfLoggedIn;
})(React.Component);

var HomeIfNotLoggedIn = (function (_React$Component2) {
    _inherits(HomeIfNotLoggedIn, _React$Component2);

    function HomeIfNotLoggedIn() {
        _classCallCheck(this, HomeIfNotLoggedIn);

        _get(Object.getPrototypeOf(HomeIfNotLoggedIn.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HomeIfNotLoggedIn, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    Navbar,
                    { fluid: true },
                    React.createElement(
                        Navbar.Header,
                        null,
                        React.createElement(
                            Navbar.Brand,
                            null,
                            React.createElement(
                                'a',
                                { style: { cursor: 'default' } },
                                'Book Tracker'
                            )
                        ),
                        React.createElement(Navbar.Toggle, null)
                    ),
                    React.createElement(
                        Navbar.Collapse,
                        null,
                        React.createElement(
                            Nav,
                            null,
                            React.createElement(
                                NavItem,
                                { href: '#login' },
                                'Login'
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    'Welcome to My-Library.  Use this site to blah blah blah. More complete description coming'
                )
            );
        }
    }]);

    return HomeIfNotLoggedIn;
})(React.Component);

var Home = (function (_React$Component3) {
    _inherits(Home, _React$Component3);

    function Home() {
        _classCallCheck(this, Home);

        _get(Object.getPrototypeOf(Home.prototype), 'constructor', this).call(this);
        this.state = { isLoggedIn: _reactStartup2['default'].isLoggedIn };
    }

    _createClass(Home, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                this.state.isLoggedIn ? React.createElement(HomeIfLoggedIn, null) : React.createElement(HomeIfNotLoggedIn, null)
            );
        }
    }]);

    return Home;
})(React.Component);

exports['default'] = Home;
module.exports = exports['default'];