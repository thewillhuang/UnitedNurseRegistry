'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var config = require('../config').images;
var browserSync = require('browser-sync');
var size = require('gulp-size');

var opt = {
  optimizationLevel: 5,
  progressive: true,
  interlaced: true
};

gulp.task('images', function() {
  return gulp.src(config.src, config.base)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(imagemin(opt)) // Optimize
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
