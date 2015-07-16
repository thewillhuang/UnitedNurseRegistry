'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../config/config').sass;
// var changed = require('gulp-changed');
// var size = require('gulp-size');

gulp.task('sass', function() {
  return gulp.src(config.src, config.base)
    // .pipe(changed(config.dest)) // Ignore unchanged files
    // Convert sass into css
    .pipe(sass(config.settings))
    // Catch any SCSS errors and prevent them from crashing gulp
    .on('error', function(error) {
      console.error(error);
      this.emit('end');
    })
    // Load existing internal sourcemap
    .pipe(sourcemaps.init(config.sourcemap))
    // Autoprefix properties
    .pipe(autoprefixer({
      browsers: ['> 1%']
    }))
    // Write final .map file
    .pipe(sourcemaps.write())
    // Save the CSS
    // .pipe(size({showFiles: true}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});
