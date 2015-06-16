'use strict';
var gulp = require('gulp');
var config = require('../config');
var browserSync = require('browser-sync');
// var cache = require('gulp-cached');
var gzip = require('gulp-gzip');
var size = require('gulp-size');

gulp.task('gzip', function() {
  return gulp.src(config.copy.src, config.copy.base)
    .pipe(gzip({threshold: true, gzipOptions: { level: 9 }}))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.copy.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
