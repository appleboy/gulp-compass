var es = require('event-stream'),
    gutil = require('gulp-util'),
    Buffer = require('buffer').Buffer,
    compass = require('./lib/compass').init();

module.exports = function(opt){
    function compile(file, cb){
        try {
            //file.contents = new Buffer(coffee.compile(String(file.contents), opt));
            file.contents = new Buffer(String(file.contents));
        } catch (err) {
            //var newError = formatError(file, err);
            //return cb(newError);
        }
        file.path = gutil.replaceExtension(file.path, ".css");
        //console.log(file.path);
        cb(null, file);
    }

    return es.map(compile);
};