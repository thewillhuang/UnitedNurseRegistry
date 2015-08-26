var gulp      = require('gulp');
var html      = require('../config/html');
var markup      = require('../config/markup');
var iconFont  = require('../config/iconFont');
var svgSprite = require('../config/svg-sprite');
var images    = require('../config/images');
var sass      = require('../config/sass');
var fonts     = require('../config/fonts');
var watch     = require('gulp-watch');
// var nodemon = require('../config/nodemon');

gulp.task('watch', ['browserSync'], function() {
  watch(images.src, function() { gulp.start('images'); });
  watch(sass.src, function() { gulp.start('sass'); });
  watch(iconFont.src, function() { gulp.start('iconFont'); });
  watch(svgSprite.src, function() { gulp.start('svg-sprite'); });
  watch(fonts.src, function() { gulp.start('fonts'); });
  watch(html.watch, function() { gulp.start('html'); });
  watch(markup.watch, function() { gulp.start('markup'); });
  // watch(nodemon.watch, function() { gulp.start('nodemon'); });
});
