'use strict';

var exec = require('child_process').exec,
    gutil = require('gulp-util'),
    path = require('path'),
    os = require('os');

module.exports = function(file, options, callback) {
    var compassExecutable = 'compass',
        file_name = path.basename(file),
        file_path = path.relative(options.cwd, file).replace(/\\/g, '/');

    if (file_name.match(/^_/)) {
        return;
    }

    if (os.platform() === 'win32') {
        compassExecutable += '.bat';
    }

    if ('function' == typeof options) {
        callback = options;
    }

    options = options || {};
    options.cwd = options.cwd || process.cwd();

    exec(compassExecutable + ' compile ' + file_path, {cwd: options.cwd}, callback);
};