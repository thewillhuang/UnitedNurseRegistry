'use strict';
var gulp = require('gulp');
var config = require('../config').markup;
var browserSync = require('browser-sync');
// var cache = require('gulp-cached');
var changed = require('gulp-changed');

gulp.task('markup', function() {
  return gulp.src(config.src)
    // .pipe(cache('markup')) //cache files and skip unchanged files
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
