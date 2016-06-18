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

function isNodeFile(file){
    console.log(Object.keys(file).join(','));
    return true;
}

gulp.task('test', function () {
    global.Redux = require('Redux');

    gulp.src('react-redux/tests/**/!(*-es6.js)') //we don't want es6 files - just the transpiled results
        .pipe(mocha());
});

gulp.task('initial-transpile', function () {
    gulp.src(['./**/**-es6.js', '!./controllers/**/*', '!./node_modules/**/*'])
        .pipe(babel({
            presets: ['stage-2', 'react'],
            plugins: ['transform-es2015-modules-commonjs', 'transform-regenerator']
        }))
        .pipe(rename(function (path) {
            path.basename = path.basename.replace(/-es6$/, '');
        }))
        .pipe(gulp.dest(''))
        .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
});

function isNodeFolder(file){
    return file.path.indexOf('\\dataAccess\\') >= 0;
}

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
                .pipe(gulpIf(isNodeFolder, babel({
                    presets: ['stage-2', 'react', 'es2015']
                }), babel({
                    presets: ['stage-2', 'react'],
                    plugins: ['transform-es2015-modules-commonjs']
                })))
                .pipe(rename(function (path) {
                    path.basename = path.basename.replace(/-es6$/, '');
                }))
                .pipe(gulp.dest(''))
                .pipe(gprint(function(filePath){ return "File processed: " + filePath; }));
        }
    });
});