'use strict';
var gulp = require('gulp');
var browserifyTask = require('./newBrowserify');

gulp.task('watchify', function() {
  // Start browserify task with devMode === true
  return browserifyTask(true);
});
