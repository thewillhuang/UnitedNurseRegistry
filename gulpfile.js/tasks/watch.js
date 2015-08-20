'use strict';
/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/
const gulp = require('gulp');
const config = require('../config/config');
// const watchify = require('./browserify');

gulp.task('watch', ['watchify', 'browserSync'], function() {
  gulp.watch(config.sass.src, ['sass']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.markup.src, ['markup']);
  gulp.watch(config.copy.src, ['copy']);
});
