var config = require('../config/config').clean;
var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function() {
  del(config.src, function(err, paths){
    // console.log('Deleted files/folders:\n', paths.join('\n'));
  });
});
