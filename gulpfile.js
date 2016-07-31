'use strict'

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    mocha = require('gulp-mocha'),
    gprint = require('gulp-print'),
    babel = require('gulp-babel'),
    fs = require('fs'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    gulpIf = require('gulp-if');

require('regenerator/runtime');

gulp.task('test', function () {
    global.Redux = require('Redux');

    gulp.src('react-redux/tests/**/!(*-es6.js)') //we don't want es6 files - just the transpiled results
        .pipe(mocha());
});

let babelOptions = {
    presets: ['react', 'es2015', 'stage-1'],
    plugins: ['transform-decorators-legacy']
};

gulp.task('transpile-all', function () {
    gulp.src(['./**/**-es6.js', '!./node_modules/**/*'])
        .pipe(babel(babelOptions))
        .pipe(rename(function (path) {
            path.basename = path.basename.replace(/-es6$/, '');
        }))
        .pipe(gulp.dest(''))
        .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
});

gulp.task('transpile-watch', function() {
    return gulp.watch(['./**/**-es6.js', '!./node_modules/**/*'], function(obj){
        if (obj.type === 'changed') {
            gulp.src(obj.path, { base: './' })
                .pipe(plumber({
                    errorHandler: function (error) {
                        //babel error - dev typed in in valid code
                        if (error.fileName) {
                            var fileParts = error.fileName.split('\\');
                            try {
                                notify.onError(error.name + ' in ' + fileParts[fileParts.length - 1])(error);
                            } catch(e) { } //gulp-notify may break if not run in Win 8
                            console.log(error.name + ' in ' + error.fileName);
                        } else{
                            notify.onError('Oh snap, file system error! :(')(error);
                        }

                        console.log('ERROR', error.message);
                        this.emit('end');
                    }
                }))
                .pipe(babel(babelOptions))
                .pipe(rename(function (path) {
                    path.basename = path.basename.replace(/-es6$/, '');
                }))
                .pipe(gulp.dest(''))
                .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
        }
    });
});