var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sh = require('shelljs');
var deletefile = require('gulp-delete-file');

var paths = {
  less: ['./less/**/*.less']
};

gulp.task('default', ['deleteless','less']);

gulp.task('less', function(done) {
  gulp.src('./less/**/*.less')
  .pipe(concat('default.less'))
  .pipe(gulp.dest('./www/css/'))
  .pipe(less())
  .pipe(gulp.dest('./www/css/'))
  .pipe(minifyCss({
    keepSpecialComments: 0
  }))
  .pipe(rename({ extname: '.min.css' }))
  .pipe(gulp.dest('./www/css/'))
  .on('end', done);
});

gulp.task('compress', function(done) {
  gulp.src('./lib/*.js')
  .pipe(concat('default.js'))
  .pipe(gulp.dest('./www/js/'))
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest('./www/js/'))
  .on('end', done);
});


gulp.task('deleteless', function(done) {
  var regexp = /default\.less$/;
  gulp.src('./www/css/*.less')
  .pipe(deletefile({
    reg: regexp,
    deleteMatch: true
  }))
  .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.less, ['default']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
