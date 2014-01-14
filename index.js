'use strict';

var es = require('event-stream'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    compass = require('./lib/compass');

module.exports = function(opt){
    function compile(file, cb){
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            return cb(new Error('gulp-compass: Streaming not supported'));
        }
        var filepath = file.path;
        compass(filepath, opt, function(code, stdout, stderr, path){
            if (code === 127) {
                return cb(new Error(
                    'You need to have Ruby and Compass installed ' +
                    'and in your system PATH for this task to work. '));
            }
            if (code === 42) {
                // This is a partial, just drop it
                return cb();
            }
            // excute callback
            file.path = gutil.replaceExtension(file.path, '.css');
            file.contents = new Buffer(fs.readFileSync(String(gutil.replaceExtension(path, '.css'))));
            cb(null, file);
        });
    }

    return es.map(compile);
};
