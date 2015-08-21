var gulp         = require('gulp')
var gulpSequence = require('gulp-sequence')

gulp.task('build:development', function(cb) {
  gulpSequence('clean', ['copy', 'fonts', 'iconFont', 'images', 'svg-sprite'], ['sass', 'webpack:development', 'markup'], cb)
});
