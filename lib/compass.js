'use strict';

var spawn = require('child_process').spawn,
    gutil = require('gulp-util'),
    path = require('path'),
    os = require('os');

module.exports = function(file, opts, callback) {
    opts = opts || {};
    opts.cwd = opts.cwd || process.cwd();

    var compassExecutable = 'compass',
        file_name = path.basename(file),
        file_path = path.relative(opts.cwd, file).replace(/\\/g, '/');

    if (file_name.match(/^_/)) {
        return;
    }

    if (os.platform() === 'win32') {
        compassExecutable += '.bat';
    }

    var options = [];
    options.push('compile');
    options.push(file_path);

    var compass = spawn(compassExecutable, options, {cwd: opts.cwd});
    compass.stdout.setEncoding('utf8');
    compass.stdout.on('data', function (data) {
        console.log(data);
    });

    compass.stderr.setEncoding('utf8');
    compass.stderr.on('data', function (data) {
        if (!data.match(/^\u001b\[\d+m$/)) {
            gutil.log(data);
        }
    });
};