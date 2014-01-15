(function(){
    'use strict';

    /**
    * Plugins load
    */
    var gulp = require('gulp');
    var map = require('map-stream');
    var jshint = require('gulp-jshint');

    /**
    * Helpers
    */
    var fs = require('fs');
    var readJSON = function(path){
        var data = fs.readFileSync(path, 'utf8');
        try{
            return JSON.parse(data);
        }catch(e){
            return JSON.parse(data.
            replace(/(\/\/.*)/gm, '').
            replace(/([\/][*](?:[^*]*|[*](?=[^\/]))*[*][\/])/g, ''));
        }
    };

    /**
    * Configuration files
    */
    // var packageJson = readJSON('package.json');

    /**
    * Commanders
    */
    var reporter = require('jshint-stylish');
    var jshintRc = readJSON('.jshintrc');

    var commandJsHint = function(pattern, dontFail){
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

})();
