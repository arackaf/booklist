"use strict";

var gulp = require("gulp"),
  rename = require("gulp-rename"),
  mocha = require("gulp-mocha"),
  gprint = require("gulp-print"),
  babel = require("gulp-babel"),
  fs = require("fs"),
  path = require("path"),
  notify = require("gulp-notify"),
  plumber = require("gulp-plumber"),
  gulpIf = require("gulp-if");

require("regenerator/runtime");

gulp.task("test", function() {
  global.Redux = require("Redux");

  gulp
    .src("react-redux/tests/**/!(*.es6)") //we don't want es6 files - just the transpiled results
    .pipe(mocha());
});

let babelOptions = {
  presets: [],
  plugins: ["transform-decorators-legacy", "babel-plugin-syntax-object-rest-spread"]
};

var gulpTargets = ["./node-src/**/*.js", "./node-src/*.js"];

gulp.task("transpile-all", function() {
  gulp
    .src(gulpTargets, { base: "./" })
    .pipe(babel(babelOptions))
    .pipe(
      rename(fileObj => {
        let dir = fileObj.dirname.replace(/\\/g, "/");
        fileObj.dirname = dir.replace(/^node-src\//, "node-dest/");
      })
    )
    .pipe(gulp.dest(""))
    .pipe(
      gprint(function(filePath) {
        return "File processed: " + filePath;
      })
    );
});

gulp.task("transpile-watch", function() {
  return gulp.watch(gulpTargets, function(obj) {
    if (obj.type === "changed") {
      gulp
        .src(obj.path, { base: "./" })
        .pipe(
          plumber({
            errorHandler: function(error) {
              //babel error - dev typed in in valid code
              if (error.fileName) {
                var fileParts = error.fileName.split("\\");
                try {
                  notify.onError(error.name + " in " + fileParts[fileParts.length - 1])(error);
                } catch (e) {} //gulp-notify may break if not run in Win 8
                console.log(error.name + " in " + error.fileName);
              } else {
                notify.onError("Oh snap, file system error! :(")(error);
              }

              console.log("ERROR", error.message);
              this.emit("end");
            }
          })
        )
        .pipe(babel(babelOptions))
        .pipe(
          rename(fileObj => {
            let dir = fileObj.dirname.replace(/\\/g, "/");
            console.log(dir);
            fileObj.dirname = dir.replace(/^node-src/, "node-dest/");
          })
        )
        .pipe(gulp.dest(""))
        .pipe(
          gprint(function(filePath) {
            return "File processed: " + filePath;
          })
        );
    }
  });
});
