'use strict';
var minifyHTML = require('gulp-minify-html');
var gulp = require('gulp');
var config = require('../config/config').minifyHtml;
var browserSync = require('browser-sync');
// var inlineCss = require('gulp-inline-css');
var size = require('gulp-size');

gulp.task('minifyHtml', ['sass', 'markup'], function() {
  return gulp.src(config.src, config.srcBase)
    // .pipe(inlineCss())
    .pipe(minifyHTML(config.opts))
    .pipe(size({showFiles: true, title: 'minifyHtml'}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
