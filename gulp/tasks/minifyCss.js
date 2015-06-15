'use strict';
var browserSync = require('browser-sync');
var gulp = require('gulp');
var config = require('../config').production;
var minifyCSS = require('gulp-minify-css');
var size = require('gulp-size');
var gzip = require('gulp-gzip');

gulp.task('minifyCss', ['sass'], function() {
  return gulp.src(config.cssSrc)
    .pipe(minifyCSS(config.cssOpt))
    .pipe(gulp.dest(config.dest))
    .pipe(gzip({threshold: true, gzipOptions: { level: 9 }}))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
