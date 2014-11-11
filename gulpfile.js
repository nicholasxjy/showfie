var gulp = require('gulp');
var scss = require('gulp-sass');
// var livereload = require('gulp-livereload');

var paths = {
  sass: './client/scss/*.scss',
  css: {
    src: './client/scss/custom.scss',
    dest: './client/css'
  },
  images: {

  },
  scripts: {

  }
}
gulp.task('sass', function() {
  gulp.src(paths.css.src)
    .pipe(scss())
    .pipe(gulp.dest(paths.css.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
})

gulp.task('default', ['watch', 'sass']);