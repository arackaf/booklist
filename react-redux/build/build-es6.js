const Builder = require('systemjs-builder');

let builder = new Builder('../');
builder.config({
    baseURL: "../",
    defaultJSExtensions: true
});

let p1 = builder.bundle('modules/books/books', 'dist/books/books.js').then(result => {
    console.log('done');
});

