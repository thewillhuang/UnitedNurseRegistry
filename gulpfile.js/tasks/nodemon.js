'use strict';

const browserSync = require('browser-sync');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const config = require('../config/nodemon');
const BROWSER_SYNC_RELOAD_DELAY = 2000;

gulp.task('nodemon', function(cb) {
  let called = false;
  return nodemon(config)
    .on('start', function onStart() {
      console.log('server started');
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload();
      }, BROWSER_SYNC_RELOAD_DELAY);
      // ensure start only got called once
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('crash', function(error) {
      console.log('server crashed');
      console.error(error);
      this.emit('end');
    })
    .on('exit', function() {
      console.log('server stopped');
    })
    .on('restart', function onRestart() {
      console.log('server restart event');
      // // reload connected browsers after a slight delay
      // setTimeout(function reload() {
      //   browserSync.reload();
      // }, BROWSER_SYNC_RELOAD_DELAY);
    });
});
