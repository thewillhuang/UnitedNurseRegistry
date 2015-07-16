'use strict';
var browserSync = require('browser-sync');
var gulp = require('gulp');
var config = require('../config/config').production;
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var sourcemapConfig = require('../config/config').sass.sourcemap;
// var size = require('gulp-size');
var gutil = require('gulp-util');

gulp.task('minifyCss', ['sass', 'copy'], function() {
  return gulp.src(config.cssSrc, config.cssBase)
    .on('error', gutil.log)
    .pipe(sourcemaps.init(sourcemapConfig))
    .pipe(minifyCSS(config.cssOpt))
    .pipe(sourcemaps.write('./'))
    // .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.cssDest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
