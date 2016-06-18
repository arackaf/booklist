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

function isClientFile(file){
    if (file.path.indexOf('\\react-redux\\build\\') >= 0 ) return false;
    return file.path.indexOf('\\react-redux\\') >= 0 || file.path.indexOf('\\transpileTest\\') >= 0;
}

gulp.task('test', function () {
    global.Redux = require('Redux');

    gulp.src('react-redux/tests/**/!(*-es6.js)') //we don't want es6 files - just the transpiled results
        .pipe(mocha());
});

gulp.task('transpile-all', function () {
    gulp.src(['./**/**-es6.js', '!./controllers/**/*', '!./node_modules/**/*'])
        .pipe(gulpIf(isClientFile, babel({
            presets: ['stage-2', 'react'],
            plugins: ['transform-es2015-modules-commonjs']
        }), babel({
            presets: ['stage-2', 'es2015']
        })))
        .pipe(rename(function (path) {
            path.basename = path.basename.replace(/-es6$/, '');
        }))
        .pipe(gulp.dest(''))
        .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
});

gulp.task('transpile-watch', function() {
    return gulp.watch(['./**/**-es6.js', '!./controllers/**/*', '!./node_modules/**/*'], function(obj){
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
                .pipe(gulpIf(isClientFile, babel({
                    presets: ['stage-2', 'react'],
                    plugins: ['transform-es2015-modules-commonjs']
                }), babel({
                    presets: ['stage-2', 'es2015']
                })))
                .pipe(rename(function (path) {
                    path.basename = path.basename.replace(/-es6$/, '');
                }))
                .pipe(gulp.dest(''))
                .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
        }
    });
});