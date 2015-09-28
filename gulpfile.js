var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
    gulp.src('tests/**/!(*-es6.js)') //we don't want es6 files - just the transpiled results
        .pipe(mocha());
});