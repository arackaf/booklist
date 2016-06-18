"use strict";

function nodeCallback(f) {
    return function (err, ...args) {
        if (err) {
            throw err;
        }
        f(...args);
    };
}

module.exports = {
    nodeCallback
};