'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
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
var path = require('path');
var browserSync = require('browser-sync');

function write(filepath) {
  return concat(function (content) {
    // create new vinyl file from content and use the basename of the
    // filepath in scope as its basename.
    return file(path.basename(filepath), content, {
        src: true
      })
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(buffer())
      .pipe(sourcemaps.init({
        loadMaps: true,
        debug: true
      })) // loads map from browserify file
      .pipe(sourcemaps.write('/')) // writes .map file
      .pipe(size({
        showFiles: true
      }))
      .pipe(gulp.dest(dest))
      .pipe(browserSync.reload({
        stream: true
      }));
  });
}

// add custom browserify options here
var e = config.bundleConfigs.map(function (value) {
  return value.entries;
});
var customOpts = {
  entries: e,
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('js', bundle); // so you can run `gulp js` to build the file
// add transformations here
// i.e. b.transform(coffeeify);
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal
b.on('factor.pipeline', function (id, pipeline) {
  pipeline.get('wrap')
    .push(write(id));
});
b.plugin('factor-bundle');

function bundle() {
  return b.bundle()
    .pipe(write('common.js'));
}
