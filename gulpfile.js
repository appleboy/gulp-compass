'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  del = require('del'),
  lib = ['**/*.js', '!test/**/*', '!node_modules/**/*', '!coverage/**/*'];


gulp.task('coverage', ['clean'], function(){
  return gulp.src(lib)
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire());
});

gulp.task('jshint', function () {
  return gulp.src(lib)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

function mochaStream(){
  return gulp.src('test/*_test.js', {read: false})
    .pipe($.mocha({
      reporter: 'spec'
    }));
}

gulp.task('mocha', ['coverage'], function () {
  return mochaStream()
    .pipe($.istanbul.writeReports());
});

gulp.task('mocha:nocov', function(){
  return mochaStream();
});

gulp.task('clean', del.bind(null, ['test/css', 'coverage/**/*']));

gulp.task('default', ['mocha', 'jshint']);
