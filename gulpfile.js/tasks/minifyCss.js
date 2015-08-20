'use strict';
const browserSync = require('browser-sync');
const gulp = require('gulp');
const config = require('../config/config').production;
const minifyCSS = require('gulp-minify-css');
const sourcemaps = require('gulp-sourcemaps');
const sourcemapConfig = require('../config/config').sass.sourcemap;
// const size = require('gulp-size');
const gutil = require('gulp-util');

gulp.task('minifyCss', ['sass', 'copy'], function() {
  return gulp.src(config.cssSrc, config.cssBase)
    .on('error', gutil.log)
    .pipe(sourcemaps.init(sourcemapConfig))
    .pipe(minifyCSS(config.cssOpt))
    .pipe(sourcemaps.write('./'))
    // .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.cssDest))
    .pipe(browserSync.reload({
      stream: true,
    }));
});
