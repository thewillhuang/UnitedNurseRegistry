const gulp = require('gulp');
const gulpFilter = require('gulp-filter');
const awspublish = require('gulp-awspublish');
const parallelize = require('concurrent-transform');
const config = require('../config/awspublish');
if (!config) return;

gulp.task('publish', function () {
  const filter = gulpFilter(config.filter, { restore: true });
  const publisher = awspublish.create(config.create);
  return gulp.src(config.src, config.srcBase)
    .pipe(filter)
    .pipe(awspublish.gzip())
    .pipe(filter.restore)
    .pipe(parallelize(publisher.publish(config.headers), 100))
    .pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(awspublish.reporter());
});