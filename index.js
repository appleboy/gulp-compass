var es = require('event-stream'),
    gutil = require('gulp-util'),
    Buffer = require('buffer').Buffer,
    compass = require('./lib/compass');

module.exports = function(opt){
    function compile(file, cb){
        var filepath = file.path;
        compass(filepath, opt, function (error, stdout, stderr) {
            console.log(stdout);
            if (error !== null) {
                gutil.log('exec error: ' + error);
            }
        });
        cb(null, file);
    }

    return es.map(compile);
};