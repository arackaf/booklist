'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('jscolor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let uniqueIdCounter = 0;

class CustomColorPicker extends _react2.default.Component {
    constructor() {
        super();
        this.uniqueId = `customColorPickerId${ ++uniqueIdCounter }`;
        this.state = {};
    }
    get valueElementId() {
        return `${ this.uniqueId }_value`;
    }
    get styleElementId() {
        return `${ this.uniqueId }_style`;
    }
    componentDidMount() {
        let colorPicker = document.getElementById(this.uniqueId);
        this.picker = new jscolor(colorPicker, { valueElement: this.valueElementId, styleElement: this.styleElementId });

        this._colorChanged = function () {
            console.log('changed to', this.value);
        };
        alert(this.valueElementId);
        document.getElementById(this.valueElementId).addEventListener('change', this._colorChanged);
    }
    colorChange() {
        console.log('changed to', this.value);
    }
    componentWillUnmount() {
        document.getElementById(`${ this.uniqueId }_value`).removeEventListener('change', this._colorChanged);
    }
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'a',
                { id: `${ this.uniqueId }`, onchange: 'alert(\'hi\')',
                    style: { width: '80px', height: '20px' } },
                'Custom'
            ),
            _react2.default.createElement('input', { style: { display: 'none' }, id: this.valueElementId, value: 'ff0000' }),
            _react2.default.createElement('input', { style: { display: 'none' }, id: this.styleElementId, id: 'styleInput' })
        );
    }
}

exports.default = CustomColorPicker;