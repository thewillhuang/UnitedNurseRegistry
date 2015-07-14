'use strict';
var browserSync = require('browser-sync');
var gulp = require('gulp');
var config = require('../config').production;
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var sourcemapConfig = require('../config').sass.sourcemap;


// var size = require('gulp-size');
// var gzip = require('gulp-gzip');

gulp.task('minifyCss', ['sass', 'copy'], function() {
  return gulp.src(config.cssSrc)
    .pipe(sourcemaps.init(sourcemapConfig))
    .pipe(minifyCSS(config.cssOpt))
    // .pipe(size({showFiles: true}))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(config.cssDest))
    // .pipe(gzip({threshold: 1400, gzipOptions: { level: 9 }}))
    // .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
