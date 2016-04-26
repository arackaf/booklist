'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var Builder = require('systemjs-builder');
var gulpUglify = require('gulp-uglify');
var gulpRename = require('gulp-rename');
var gulp = require('gulp');

var builder = new Builder('../../');
builder.config({
    defaultJSExtensions: true,
    map: {
        'react-redux-util': 'react-redux/util',
        'root-components': 'react-redux/applicationRoot/rootComponents',
        'application-root': 'react-redux/applicationRoot',
        'react-startup': 'react-redux/reactStartup',
        'global-utils': 'utils'
    }
});

var p1 = builder.bundle('react-redux/modules/books/books', '../dist/books/books-unminified.js');

Promise.all([p1]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var p1Results = _ref2[0];

    p1Results.modules.forEach(function (m) {
        return console.log(m, '\n');
    });

    gulp.src(['../dist/books/books-unminified.js'], { base: './' }).pipe(gulpUglify()).pipe(gulpRename(function (path) {
        path.basename = path.basename.replace(/-unminified$/, '');
        console.log('Finished compressing ' + path.basename);
    })).pipe(gulp.dest('')).on('end', function () {
        return console.log('minified');
    });
})['catch'](function (err) {
    return console.log(err);
});