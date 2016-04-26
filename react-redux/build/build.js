'use strict';

var Builder = require('systemjs-builder');

var builder = new Builder('../');
builder.config({
    baseURL: "../",
    defaultJSExtensions: true
});

var p1 = builder.bundle('modules/books/books', 'dist/books/books.js').then(function (result) {
    console.log('done');
});