var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../lib/handleErrors');
var config       = require('../config/sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var gulpif       = require('gulp-if');

gulp.task('sass', function () {
  return gulp.src(config.src)
    .pipe(sourcemaps.init(config.sourcemaps))
    .pipe(sass(config.settings))
    .on('error', handleErrors)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulpif(process.env.NODE_ENV === 'production', minifyCSS()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
