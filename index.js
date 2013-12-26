var es = require('event-stream'),
    gutil = require('gulp-util'),
    Buffer = require('buffer').Buffer,
    compass = require('./lib/compass');

module.exports = function(opt){
    function compile(file, cb){
        var filepath = file.path;
        compass(filepath, opt);
        cb(null, file);
    }

    return es.map(compile);
};