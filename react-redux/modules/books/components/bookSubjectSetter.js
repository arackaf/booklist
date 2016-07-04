'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _bootstrapButton = require('applicationRoot/rootComponents/bootstrapButton');

var _bootstrapButton2 = _interopRequireDefault(_bootstrapButton);

var _ajaxButton = require('applicationRoot/rootComponents/ajaxButton');

var _ajaxButton2 = _interopRequireDefault(_ajaxButton);

var _reducer = require('../reducers/booksSubjectModification/reducer');

var _actionCreators = require('../reducers/booksSubjectModification/actionCreators');

var bookSubjectActionCreators = _interopRequireWildcard(_actionCreators);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BookSubjectSetterDesktopUnConnected extends _react2.default.Component {
    setBooksSubjects() {
        this.props.setBooksSubjects(this.props.modifyingBooks.map(b => b._id), this.props.addingSubjects.map(s => s._id), this.props.removingSubjects.map(s => s._id));
    }
    render() {
        return _react2.default.createElement(
            _reactBootstrap.Modal,
            { show: !!this.props.modifyingBooks.length, onHide: this.props.cancelBookSubjectModification },
            _react2.default.createElement(
                _reactBootstrap.Modal.Header,
                { closeButton: true },
                _react2.default.createElement(
                    _reactBootstrap.Modal.Title,
                    null,
                    'Edit subjects for:',
                    _react2.default.createElement(
                        'div',
                        null,
                        this.props.modifyingBooks.map(book => _react2.default.createElement(
                            'h5',
                            { key: book._id },
                            book.title
                        ))
                    )
                )
            ),
            _react2.default.createElement(
                _reactBootstrap.Modal.Body,
                null,
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        _bootstrapButton2.default,
                        { preset: 'primary-xs', className: 'pull-right', onClick: this.props.subjectModificationClearSubjects },
                        'Reset subjects'
                    )
                ),
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'b',
                        null,
                        'Add'
                    ),
                    ' ',
                    this.props.addingSubjects.map(subject => _react2.default.createElement(
                        'span',
                        { className: 'label label-primary', style: { marginRight: 5, display: 'inline-block' }, key: subject._id },
                        subject.name
                    ))
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'panel panel-default', style: { maxHeight: 150, overflow: 'scroll' } },
                    _react2.default.createElement(
                        'div',
                        { className: 'panel-body', style: { paddingTop: 0 } },
                        this.props.allSubjectsSorted.map(s => _react2.default.createElement(
                            'div',
                            { className: 'checkbox', key: s._id },
                            _react2.default.createElement(
                                'label',
                                null,
                                _react2.default.createElement('input', { type: 'checkbox', checked: !!this.props.addingSubjectIds[s._id], onChange: () => this.props.toggleSubjectModificationAdd(s._id) }),
                                ' ',
                                s.name
                            )
                        ))
                    )
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'b',
                        null,
                        'Remove'
                    ),
                    ' ',
                    this.props.removingSubjects.map(subject => _react2.default.createElement(
                        'span',
                        { className: 'label label-primary', style: { marginRight: 5, display: 'inline-block' }, key: subject._id },
                        subject.name
                    ))
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'panel panel-default', style: { maxHeight: 150, overflow: 'scroll' } },
                    _react2.default.createElement(
                        'div',
                        { className: 'panel-body', style: { paddingTop: 0 } },
                        this.props.allSubjectsSorted.map(s => _react2.default.createElement(
                            'div',
                            { className: 'checkbox', key: s._id },
                            _react2.default.createElement(
                                'label',
                                null,
                                _react2.default.createElement('input', { type: 'checkbox', checked: !!this.props.removingSubjectIds[s._id], onChange: () => this.props.toggleSubjectModificationRemove(s._id) }),
                                ' ',
                                s.name
                            )
                        ))
                    )
                )
            ),
            _react2.default.createElement(
                _reactBootstrap.Modal.Footer,
                null,
                _react2.default.createElement(
                    _ajaxButton2.default,
                    { preset: 'primary', running: this.props.settingBooksSubjects, runningText: 'Setting', onClick: () => this.setBooksSubjects() },
                    'Set'
                ),
                _react2.default.createElement(
                    _bootstrapButton2.default,
                    { preset: '', onClick: this.props.cancelBookSubjectModification },
                    'Cancel'
                )
            )
        );
    }
}

const BookSubjectSetterDesktop = (0, _reactRedux.connect)(state => (0, _reducer.booksSubjectsModifierSelector)(state.books), _extends({}, bookSubjectActionCreators))(BookSubjectSetterDesktopUnConnected);

exports.default = BookSubjectSetterDesktop;