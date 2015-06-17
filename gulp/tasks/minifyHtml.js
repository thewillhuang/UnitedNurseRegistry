'use strict';
var minifyHTML = require('gulp-minify-html');
var gulp = require('gulp');
var config = require('../config').minifyHtml;
var browserSync = require('browser-sync');
var size = require('gulp-size');
var gzip = require('gulp-gzip');

gulp.task('minifyHtml', ['markup'], function() {
  return gulp.src(config.src)
    .pipe(minifyHTML(config.opts))
    .pipe(gulp.dest(config.dest))
    .pipe(gzip({threshold: 1400, gzipOptions: { level: 9 }}))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
