'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var _ = require('lodash');
var assign = _.assign;
var concat = require('concat-stream');
var file = require('gulp-file');
var size = require('gulp-size');
var config = require('../config').browserify;
var dest = config.dest;
// var browserSync = require('browser-sync');

function write(name) {
  return concat(function (content) {
    // create new vinyl file from content and use the basename of the
    // filepath in scope as its basename.
    // console.log(name, content);
    return file(name, content, {
        src: false
      })
      .on('error', gutil.log.bind(gutil, 'Factor-bundle Error'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write(dest))
      .pipe(size({ showFiles: true }))
      .pipe(gulp.dest(dest));
      // .pipe(browserSync.reload({ stream: true }));
  });
}

// add custom browserify options here
var e = config.bundleConfigs.map(function (value) {
  return value.entries;
});
var customOpts = { entries: e, debug: true };
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);

var o = config.bundleConfigs.map(function (value) {
  return write(value.dest + '/' + value.outputName);
});

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal
b.plugin('factor-bundle', { outputs: o });

function bundle() {
  b.plugin('factor-bundle', { outputs: o });
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('common.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write(dest)) // writes .map file
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(dest));
    // .pipe(browserSync.reload({ stream: true }));
}
