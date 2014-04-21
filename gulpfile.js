'use strict';

/**
* Plugins load
*/
var gulp = require('gulp'),
jshint = require('gulp-jshint'),
mocha = require('gulp-mocha'),
clean = require('gulp-clean'),
reporter = require('jshint-stylish');

gulp.task('hint', function () {
  return gulp.src(['**/*.js', '!node_modules/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter(reporter));
});

gulp.task('mocha', ['clean'], function () {
  return gulp.src('test/*_test.js')
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('clean', function () {
  return gulp.src('test/css', {read: false})
    .pipe(clean());
});

gulp.task('default', ['hint', 'mocha']);
