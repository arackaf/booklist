const Builder = require('systemjs-builder');
const gulpUglify = require('gulp-uglify');
const gulpRename = require('gulp-rename');
const gulp = require('gulp');
const glob = require('glob');

let builder = new Builder({
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

const files = glob.sync('../../react-redux/applicationRoot/**/*.js')
                  .filter(file => !/-es6.js$/.test(file))
                  .map(file => file.replace('../../react-redux/', ''));

let paths = files.join(' + ');

let p1 = builder.bundle('reactStartup + ' + paths, '../dist/shared-unminified.js');
let p2 = builder.bundle('modules/books/books', '../dist/books/books-unminified.js');

Promise.all([p1, p2]).then(([shared, p1Results]) => {
    p1Results.modules.forEach(m => console.log(m, '\n'));

    gulp.src(['../dist/**/*-unminified.js'], {base: './'})
        .pipe(gulpUglify())
        .pipe(gulpRename(function (path) {
            path.basename = path.basename.replace(/-unminified$/, '');
            console.log(`Finished compressing ${path.basename}`);
        }))
        .pipe(gulp.dest(''))
        .on('end', () => console.log('minified'));
}).catch(err => console.log(err));

