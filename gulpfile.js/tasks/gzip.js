'use strict';
var gulp = require('gulp');
var config       = require('../config/gzip');
var gzip = require('gulp-gzip');
// const size = require('gulp-size');
var gulpFilter = require('gulp-filter');

gulp.task('gzip', function() {
  var filter = gulpFilter(config.filter);
  return gulp.src(config.src, config.srcBase)
    .pipe(filter)
    .pipe(gzip(config.opts))
    // .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.dest));
});
