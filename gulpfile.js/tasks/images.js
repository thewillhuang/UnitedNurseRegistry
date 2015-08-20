'use strict';

const changed = require('gulp-changed');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const config = require('../config/config').images;
const browserSync = require('browser-sync');
const size = require('gulp-size');

const opt = {
  optimizationLevel: 5,
  progressive: true,
  interlaced: true,
};

gulp.task('images', function() {
  return gulp.src(config.src, config.base)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(imagemin(opt)) // Optimize
    .pipe(size({showFiles: true, title: 'images'}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true,
    }));
});
