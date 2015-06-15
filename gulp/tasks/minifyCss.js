'use strict';
var browserSync = require('browser-sync');
var gulp = require('gulp');
var config = require('../config').production;
var minifyCSS = require('gulp-minify-css');
var size = require('gulp-size');

gulp.task('minifyCss', ['sass'], function() {
  return gulp.src(config.cssSrc)
    .pipe(size({showFiles: true, gzip: true}))
    .pipe(minifyCSS(config.cssOpt))
    .pipe(size({showFiles: true, gzip: true}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
