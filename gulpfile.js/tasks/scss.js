'use strict';

const browserSync = require('browser-sync');
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../config/config').sass;
// const changed = require('gulp-changed');
const size = require('gulp-size');

gulp.task('sass', ['clean'], function() {
  return gulp.src(config.src, config.base)
    // .pipe(changed(config.dest)) // Ignore unchanged files
    // Convert sass into css
    .pipe(sass(config.settings))
    .pipe(sourcemaps.init({debug: true}))
    // Catch any SCSS errors and prevent them from crashing gulp
    .on('error', function(error) {
      console.error(error);
      this.emit('end');
    })
    // Load existing internal sourcemap
    // Autoprefix properties
    .pipe(autoprefixer({
      browsers: ['> 1%'],
    }))
    // Write final .map file
    .pipe(sourcemaps.write())
    // Save the CSS
    .pipe(size({showFiles: true, title: 'scss'}))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({
      stream: true,
    }));
});
