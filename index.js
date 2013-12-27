var es = require('event-stream'),
    gutil = require('gulp-util'),
    Buffer = require('buffer').Buffer,
    compass = require('./lib/compass');

module.exports = function(opt, callback){
    function compile(file, cb){
        var filepath = file.path;
        compass(filepath, opt, callback);
        cb(null, file);
    }

    return es.map(compile);
};