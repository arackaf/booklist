"use strict";

var Promise = global.Promise;

Promise.delayed = function (f) {
    var resolve = undefined,
        p = new Promise(function (res) {
        return resolve = res;
    }),
        result = p.then(function () {
        return new Promise(f);
    });

    result.start = function () {
        return (resolve(), result);
    };
    return result;
};