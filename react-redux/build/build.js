'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var Builder = require('systemjs-builder');
var gulpUglify = require('gulp-uglify');
var gulpRename = require('gulp-rename');
var gulp = require('gulp');
var glob = require('glob');

var builder = new Builder({
    baseURL: '../'
});
builder.config({
    defaultJSExtensions: true,
    map: {
        'react-redux-util': 'util',
        'root-components': 'applicationRoot/rootComponents',
        'application-root': 'applicationRoot',
        'react-startup': 'reactStartup'
    }
});

var files = glob.sync('../../react-redux/applicationRoot/**/*.js').filter(function (file) {
    return !/-es6.js$/.test(file);
}).map(function (file) {
    return file.replace('../../react-redux/', '');
});

var paths = files.join(' + ');

var p1 = builder.bundle('reactStartup + ' + paths, '../dist/shared-unminified.js');
var p2 = builder.bundle('modules/books/books', '../dist/books/books-unminified.js');

Promise.all([p1, p2]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var shared = _ref2[0];
    var p1Results = _ref2[1];

    p1Results.modules.forEach(function (m) {
        return console.log(m, '\n');
    });

    gulp.src(['../dist/**/*-unminified.js'], { base: './' }).pipe(gulpUglify()).pipe(gulpRename(function (path) {
        path.basename = path.basename.replace(/-unminified$/, '');
        console.log('Finished compressing ' + path.basename);
    })).pipe(gulp.dest('')).on('end', function () {
        return console.log('minified');
    });
})['catch'](function (err) {
    return console.log(err);
});