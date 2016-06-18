'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _x = require('x');

var _x2 = _interopRequireDefault(_x);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class c {
    constructor(options, ...rest) {
        let { a, b, c } = options,
            arr = rest,
            arr2 = [...arr];

        const addByHof = a => b => a + b;

        let obj = { a, b, c };
    }
    iHaveStage2ObjSpread(obj) {
        let objClone = _extends({}, obj);
    }
    asyncFunc() {
        var _this = this;

        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var a, b;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return something();

                    case 2:
                        a = _context.sent;
                        _context.next = 5;
                        return somethingElse();

                    case 5:
                        b = _context.sent;
                        _context.next = 8;
                        return Promise.all([somethingWithA(a), somethingWithB(b)]);

                    case 8:
                        return _context.abrupt('return', 'Done!');

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }, _callee, _this);
        }))();
    }
    generatorFunc() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return 1;

                case 2:
                    _context2.next = 4;
                    return 2;

                case 4:
                    _context2.next = 6;
                    return 3;

                case 6:
                case 'end':
                    return _context2.stop();
            }
        }, _callee2, this);
    }
    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    null,
                    React.createElement(
                        'label',
                        null,
                        'Hi there'
                    ),
                    React.createElement(
                        'button',
                        { onClick: () => alert('You clicked me!') },
                        'Click me'
                    )
                )
            )
        );
    }
}