var gulp         = require('gulp')
var gulpSequence = require('gulp-sequence')

gulp.task('build:development', function(cb) {
  gulpSequence('clean', ['copy', 'fonts', 'iconFont', 'images', 'svg-sprite'], ['webpack:development', 'sass', 'markup'], 'nodemon', cb);
  // gulpSequence('clean', ['copy', 'fonts', 'iconFont', 'images', 'svg-sprite'], ['webpack:development', 'sass', 'markup'], cb);
});
