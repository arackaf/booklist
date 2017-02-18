'use strict'

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    mocha = require('gulp-mocha'),
    gprint = require('gulp-print'),
    babel = require('gulp-babel'),
    fs = require('fs'),
    path = require('path'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    gulpIf = require('gulp-if');

require('regenerator/runtime');

gulp.task('test', function () {
    global.Redux = require('Redux');

    gulp.src('react-redux/tests/**/!(*.es6)') //we don't want es6 files - just the transpiled results
        .pipe(mocha());
});

let babelOptions = {
    presets: ['react' , 'es2015', 'stage-0', 'stage-1'],
    plugins: ['transform-decorators-legacy']
};

var gulpTargets = [
    'amazonDataAccess',
    'app-helpers',
    'controllers',
    'dataAccess',
    'private'
].map(f => `./` + f + '/**/*.es6')
gulpTargets.push('./*.es6');

gulp.task('transpile-all', function () {
    gulp.src(gulpTargets, { base: './' })
        .pipe(babel(babelOptions))
        .pipe(rename({ extname: ".js" }))
        .pipe(gulp.dest(''))
        .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
});

gulp.task('transpile-watch', function() {
    return gulp.watch(gulpTargets, function(obj){
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
                .pipe(rename({ extname: ".js" }))
                .pipe(gulp.dest(''))
                .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
        }
    });
});