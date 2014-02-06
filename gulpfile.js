(function() {
    'use strict';

    /**
    * Plugins load
    */
    var gulp = require('gulp'),
        map = require('map-stream'),
        jshint = require('gulp-jshint'),
        fs = require('fs'),
        mocha = require('gulp-mocha'),

    /**
    * Helpers
    */
    readJSON = function(path) {
        var data = fs.readFileSync(path, 'utf8');
        try{
            return JSON.parse(data);
        }catch(e){
            return JSON.parse(data.
            replace(/(\/\/.*)/gm, '').
            replace(/([\/][*](?:[^*]*|[*](?=[^\/]))*[*][\/])/g, ''));
        }
    },

    /**
    * Commanders
    */
    reporter = require('jshint-stylish'),
    jshintRc = readJSON('.jshintrc'),

    commandJsHint = function(pattern, dontFail) {
        return function() {
            return gulp.src(pattern)
                .pipe(jshint(jshintRc))
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

    gulp.task('mocha', function () {
        return gulp.src('test/*_test.js')
            .pipe(mocha({reporter: 'spec'}));
    });

    gulp.task('travis', ['hint', 'mocha']);
})();
