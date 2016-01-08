// 
//
// const gulp = require('gulp');
// const browserSync = require('browser-sync');
// const root = require('../config/index');
// const purify = require('gulp-purifycss');
// // console.log(root.publicDirectory + '**/*.{jsx,js,html}');
// const config = require('../config/sass');
//
// gulp.task('purify', function () {
//   return gulp.src(root.publicDirectory + '/**/*.css')
//     .pipe(purify([
//       root.sourceDirectory + '**/*.jsx',
//       root.sourceDirectory + '**/*.js',
//       root.sourceDirectory + '**/*.html',
//     ], { info: true, rejected: true }))
//     .pipe(gulp.dest(root.publicDirectory))
//     .pipe(browserSync.reload({ stream: true }));
// });
