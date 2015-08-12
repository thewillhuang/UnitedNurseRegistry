'use strict';

const watchify = require('watchify');
const browserify = require('browserify');
const gulp = require('gulp');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const _ = require('lodash');
const assign = _.assign;
const concat = require('concat-stream');
const file = require('gulp-file');
const size = require('gulp-size');
const config = require('../config/config').browserify;
const dest = config.dest;
const path = require('path');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');

const write = function(filepath) {
  return concat(function(content) {
    // create new vinyl file from content and use the basename of the
    // filepath in scope as its basename.
    return file(path.join(config.baseDir, path.basename(filepath)), content, { src: true })
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(sourcemaps.init({loadMaps: true, debug: true}))
      .pipe(buffer())
      .pipe(size({ showFiles: true }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(dest))
      .pipe(browserSync.reload({ stream: true }));
  });
};

const browserifyTask = function(devMode) {
  // add custom browserify options here
  const e = config.bundleConfigs.map(function(value) { return value.entries; });
  const customOpts = { entries: e, debug: true };
  const opts = assign({}, watchify.args, customOpts);

  let b;
  if (devMode) {
    b = watchify(browserify(opts));
  } else {
    b = browserify(customOpts);
  }

  const bundle = function() {
    return b.bundle()
      .pipe(write('common.js'));
  };

  // add transformations here
  // i.e. b.transform(coffeeify);
  b.on('update', bundle); // on any dep update, runs the bundler
  b.on('log', gutil.log); // output build logs to terminal
  b.on('factor.pipeline', function(id, pipeline) {
    pipeline.get('wrap')
      .push(write(id));
  });
  b.plugin('factor-bundle');

  return bundle();
};

gulp.task('browserify', ['clean', 'copy'], function() {
  return browserifyTask();
});

module.exports = browserifyTask;
