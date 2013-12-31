'use strict';

var es = require('event-stream'),
    compass = require('./lib/compass');

module.exports = function(opt){
    function compile(file, cb){
        var filepath = file.path;
        compass(filepath, opt, function(code, stdout, stderr){
            if (code === 127) {
                return cb(new Error(
                    'You need to have Ruby and Compass installed ' +
                    'and in your system PATH for this task to work. '));
            }
            // excute callback
            cb(null, file);
        });
    }

    return es.map(compile);
};
