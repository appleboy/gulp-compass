(function() {
    'use strict';

    /**
    * Plugins load
    */
    var gulp = require('gulp'),
        map = require('map-stream'),
        jshint = require('gulp-jshint'),
        mocha = require('gulp-mocha'),
        clean = require('gulp-clean'),

    /**
    * Commanders
    */
    reporter = require('jshint-stylish'),

    commandJsHint = function(pattern, dontFail) {
        return function() {
            return gulp.src(pattern)
                .pipe(jshint())
                .pipe(jshint.reporter(reporter))
                .pipe(map(function (file, cb) {
                    cb(!dontFail && !file.jshint.success, file);
                }));
        };
    };

    /**
    * Jshint
    */
    gulp.task('hint', commandJsHint(
        ['**/*.js', '!node_modules/**/*']
    ));

    gulp.task('mocha', ['clean'], function () {
        return gulp.src('test/*_test.js')
            .pipe(mocha({reporter: 'spec'}));
    });

    gulp.task('clean', function () {
        return gulp.src('test/css', {read: false})
            .pipe(clean());
    });

    gulp.task('travis', ['hint', 'mocha']);
})();
