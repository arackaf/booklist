'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _actionsBookSearchActionCreators = require('../actions/bookSearch/actionCreators');

var bookSearchActionCreators = _interopRequireWildcard(_actionsBookSearchActionCreators);

var Modal = ReactBootstrap.Modal;
var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var NavDropdown = ReactBootstrap.NavDropdown;
var DropDownButton = ReactBootstrap.DropDownButton;
var MenuItem = ReactBootstrap.MenuItem;
var HierarchicalSelectableSubjectList = require('./hierarchicalSelectableSubjectList');

var BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
var hashUtil = require('/utils/hashManager');

var _require = require('../reducers/bookSearchReducer');

var bookSearchSelector = _require.bookSearchSelector;

var BookFilters = (function (_React$Component) {
    _inherits(BookFilters, _React$Component);

    function BookFilters(props) {
        var _this = this;

        _classCallCheck(this, BookFilters);

        _get(Object.getPrototypeOf(BookFilters.prototype), 'constructor', this).call(this);
        this.togglePendingSubject = this.togglePendingSubject.bind(this);
        this.hashManager = new hashUtil();

        this.state = { pendingSubjects: {} };
        this._hashChangeSubscription = function () {
            props.setSearchFilterText(_this.hashManager.getCurrentHashValueOf('bookSearch') || '');
            var subjectsSelected = {},
                selectedSubjectsHashString = _this.hashManager.getCurrentHashValueOf('filterSubjects');
            if (selectedSubjectsHashString) {
                selectedSubjectsHashString.split('-').forEach(function (_id) {
                    return subjectsSelected[_id] = true;
                });
            }

            props.setFilteredSubjects(subjectsSelected, _this.hashManager.getCurrentHashValueOf('searchChildSubjects') ? 'true' : null);

            _this.state = { menuOpen: false };
        };
        window.addEventListener("hashchange", this._hashChangeSubscription);
    }

    _createClass(BookFilters, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.setSearchFilterText(this.hashManager.getCurrentHashValueOf('bookSearch') || '');
            this._hashChangeSubscription();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            if (this.props.searchText !== newProps.searchText) {
                this.refs.searchInput.value = newProps.searchText;
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener("hashchange", this._hashChangeSubscription);
        }
    }, {
        key: 'openSubjectsFilterModal',
        value: function openSubjectsFilterModal() {
            this.setState({ subjectFiltersModalOpen: true, pendingSubjects: this.props.subjects, searchChildSubjects: this.props.searchChildSubjects });
        }
    }, {
        key: 'closeSubjectsFilterModal',
        value: function closeSubjectsFilterModal() {
            this.setState({ subjectFiltersModalOpen: false });
        }
    }, {
        key: 'applySubjectsFilters',
        value: function applySubjectsFilters() {
            var _this2 = this;

            this.setState({ subjectFiltersModalOpen: false });

            var filterSubjectsVal = Object.keys(this.state.pendingSubjects).filter(function (k) {
                return _this2.state.pendingSubjects[k];
            }).join('-');
            this.hashManager.setValues('filterSubjects', filterSubjectsVal, 'searchChildSubjects', this.state.searchChildSubjects && filterSubjectsVal ? 'true' : null);
        }
    }, {
        key: 'togglePendingSubject',
        value: function togglePendingSubject(_id) {
            this.setState({ pendingSubjects: _extends({}, this.state.pendingSubjects, _defineProperty({}, _id, !this.state.pendingSubjects[_id])) });
        }
    }, {
        key: 'dropdownToggle',
        value: function dropdownToggle(newValue) {
            if (this._forceOpen) {
                this.setState({ menuOpen: true });
                this._forceOpen = false;
            } else {
                this.setState({ menuOpen: newValue });
            }
        }
    }, {
        key: 'menuItemClickedThatShouldntCloseDropdown',
        value: function menuItemClickedThatShouldntCloseDropdown() {
            this._forceOpen = true;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var selectedSubjectsCount = this.props.selectedSubjects.length,
                selectedSubjectsHeader = 'Searching ' + selectedSubjectsCount + ' Subject' + (selectedSubjectsCount === 1 ? '' : 's');

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
                                'Search filters'
                            )
                        ),
                        React.createElement(Navbar.Toggle, null)
                    ),
                    React.createElement(
                        Navbar.Collapse,
                        null,
                        React.createElement(
                            Navbar.Form,
                            { pullLeft: true },
                            React.createElement(
                                'div',
                                { className: 'form-group' },
                                React.createElement(
                                    BootstrapButton,
                                    { preset: 'primary-sm', onClick: function () {
                                            return _this3.openSubjectsFilterModal();
                                        } },
                                    'Filter by subject'
                                )
                            ),
                            ' ',
                            React.createElement(
                                'div',
                                { className: 'form-group' },
                                React.createElement('input', { className: 'form-control', onKeyDown: function (evt) {
                                        return _this3.searchFilterKeyDown(evt);
                                    }, ref: 'searchInput' })
                            )
                        ),
                        React.createElement(
                            Nav,
                            null,
                            selectedSubjectsCount ? React.createElement(
                                NavDropdown,
                                { open: this.state.menuOpen, onToggle: function (val) {
                                        return _this3.dropdownToggle(val);
                                    }, title: selectedSubjectsHeader, id: 'sel-subjects-dropdown' },
                                this.props.selectedSubjects.filter(function (s) {
                                    return s;
                                }).map(function (s) {
                                    return React.createElement(
                                        MenuItem,
                                        { onClick: function () {
                                                return _this3.menuItemClickedThatShouldntCloseDropdown();
                                            }, className: 'default-cursor no-hover', key: s._id },
                                        React.createElement(
                                            'span',
                                            { className: 'label label-primary' },
                                            React.createElement(
                                                'span',
                                                { style: { cursor: 'pointer' } },
                                                'X'
                                            ),
                                            React.createElement(
                                                'span',
                                                { style: { marginLeft: 5, paddingLeft: 5, borderLeft: '1px solid white' } },
                                                s.name
                                            )
                                        )
                                    );
                                }),
                                !!this.props.searchChildSubjects ? React.createElement(
                                    MenuItem,
                                    { onClick: function () {
                                            return _this3.menuItemClickedThatShouldntCloseDropdown();
                                        }, className: 'default-cursor no-hover' },
                                    React.createElement(
                                        'span',
                                        { className: 'label label-success' },
                                        'Searching child subjects'
                                    )
                                ) : null
                            ) : null
                        )
                    )
                ),
                React.createElement(
                    Modal,
                    { show: this.state.subjectFiltersModalOpen, onHide: function () {
                            return _this3.closeSubjectsFilterModal();
                        } },
                    React.createElement(
                        Modal.Header,
                        { closeButton: true },
                        React.createElement(
                            Modal.Title,
                            null,
                            'Filter subjects'
                        )
                    ),
                    React.createElement(
                        Modal.Body,
                        null,
                        React.createElement(
                            'label',
                            null,
                            'Also search child subjects ',
                            React.createElement('input', { type: 'checkbox', onChange: function (evt) {
                                    return _this3.setState({ searchChildSubjects: evt.target.checked });
                                }, checked: this.state.searchChildSubjects })
                        ),
                        React.createElement(HierarchicalSelectableSubjectList, {
                            toggleFilteredSubject: this.togglePendingSubject,
                            subjects: this.props.allSubjects,
                            selectedSubjects: this.state.pendingSubjects }),
                        this.props.selectedSubjects.length ? React.createElement(
                            'span',
                            null,
                            'Selected subjects: ',
                            React.createElement(
                                'span',
                                null,
                                this.props.selectedSubjects.map(function (s) {
                                    return s.name;
                                }).join(', ')
                            )
                        ) : null
                    ),
                    React.createElement(
                        Modal.Footer,
                        null,
                        React.createElement(
                            BootstrapButton,
                            { preset: 'default', className: 'pull-left', onClick: function () {
                                    return _this3.closeSubjectsFilterModal();
                                } },
                            'Close'
                        ),
                        React.createElement(
                            BootstrapButton,
                            { preset: 'primary', onClick: function () {
                                    return _this3.applySubjectsFilters();
                                } },
                            'Filter'
                        )
                    )
                )
            );
        }
    }, {
        key: 'searchFilterKeyDown',
        value: function searchFilterKeyDown(evt) {
            if (evt.which == 13) {
                this.hashManager.setValueOf('bookSearch', evt.target.value);
            }
        }
    }]);

    return BookFilters;
})(React.Component);

var BookFiltersConnected = ReactRedux.connect(function (state) {
    return bookSearchSelector(state.bookList);
}, _extends({}, bookSearchActionCreators))(BookFilters);

exports['default'] = BookFiltersConnected;
module.exports = exports['default'];