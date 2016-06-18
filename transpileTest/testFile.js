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
        return _asyncToGenerator(function* () {
            let a = yield something(),
                b = yield somethingElse();

            yield Promise.all([somethingWithA(a), somethingWithB(b)]);

            return 'Done!';
        })();
    }
    *generatorFunc() {
        yield 1;
        yield 2;
        yield 3;
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