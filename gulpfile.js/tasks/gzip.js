'use strict';
var gulp = require('gulp');
var config = require('../config/config');
var browserSync = require('browser-sync');
var gzip = require('gulp-gzip');
var size = require('gulp-size');
var gulpFilter = require('gulp-filter');

gulp.task('gzip', ['copy', 'minifyHtml', 'minifyCss', 'uglifyJs'], function() {
  var filter = gulpFilter(config.gzip.filter);
  return gulp.src(config.gzip.src, config.gzip.srcBase)
    .pipe(filter)
    .pipe(gzip(config.gzip.opts))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.gzip.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});