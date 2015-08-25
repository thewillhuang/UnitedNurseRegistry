'use strict';

const gulp         = require('gulp');
const browserSync  = require('browser-sync');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const handleErrors = require('../lib/handleErrors');
const config       = require('../config/sass');
const autoprefixer = require('gulp-autoprefixer');
const minifyCSS = require('gulp-minify-css');
const gulpif       = require('gulp-if');

gulp.task('sass', function() {
  return gulp.src(config.src)
    .pipe(sourcemaps.init(config.sourcemaps))
    .pipe(sass(config.settings))
    .on('error', handleErrors)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulpif(process.env.NODE_ENV === 'production', minifyCSS(config.minify)))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream: true}));
});
