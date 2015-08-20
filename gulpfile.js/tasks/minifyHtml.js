'use strict';
const minifyHTML = require('gulp-minify-html');
const gulp = require('gulp');
const config = require('../config/config').minifyHtml;
const browserSync = require('browser-sync');
// const inlineCss = require('gulp-inline-css');
const size = require('gulp-size');

gulp.task('minifyHtml', ['sass', 'markup'], function() {
  return gulp.src(config.src, config.srcBase)
    // .pipe(inlineCss())
    .pipe(minifyHTML(config.opts))
    .pipe(size({showFiles: true, title: 'minifyHtml'}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true,
    }));
});
