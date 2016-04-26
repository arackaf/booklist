const Builder = require('systemjs-builder');
const gulpUglify = require('gulp-uglify');
const gulpRename = require('gulp-rename');
const gulp = require('gulp');

let builder = new Builder('../../');
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

let p1 = builder.bundle('react-redux/modules/books/books', '../dist/books/books-unminified.js');

Promise.all([p1]).then(([p1Results]) => {
    p1Results.modules.forEach(m => console.log(m, '\n'));

    gulp.src(['../dist/books/books-unminified.js'], {base: './'})
        .pipe(gulpUglify())
        .pipe(gulpRename(function (path) {
            path.basename = path.basename.replace(/-unminified$/, '');
            console.log(`Finished compressing ${path.basename}`);
        }))
        .pipe(gulp.dest(''))
        .on('end', () => console.log('minified'));
}).catch(err => console.log(err));

