"use strict";

function nodeCallback(f) {
    return function (err) {
        if (err) {
            throw err;
        }

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        f.apply(undefined, args);
    };
}

module.exports = {
    nodeCallback: nodeCallback
};