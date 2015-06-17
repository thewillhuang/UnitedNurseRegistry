'use strict';
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
var gzip = require('gulp-gzip');
var size = require('gulp-size');
var gulpFilter = require('gulp-filter');

gulp.task('gzip', ['copyAll'], function() {
  var filter = gulpFilter(config.gzip.filter);
  return gulp.src(config.copy.src, config.copy.base)
    .pipe(filter)
    .pipe(gzip(config.gzip.opts))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.copy.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
