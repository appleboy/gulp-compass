'use strict';

var spawn = require('child_process').spawn,
    gutil = require('gulp-util'),
    path = require('path'),
    os = require('os'),
    defaults = {
        style: 'nested',
        comments: true,
        relative: true,
        css: 'css',
        sass: 'sass',
        image: 'images',
        config_file: false,
        project: process.cwd()
    };

module.exports = function(file, opts) {
    opts = opts || {};
    opts.cwd = opts.cwd || process.cwd();

    for (var key in defaults) {
        if (opts[key] === undefined) {
            opts[key] = defaults[key];
        }
    }

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

    // set compass setting
    if (opts.config_file) {
        options.push('-c', opts.config_file);
    } else {
        if (!opts.comments) { options.push('--no-line-comments'); }
        if (opts.relative) { options.push('--relative-assets'); }
        options.push('--output-style', opts.style);
        options.push('--css-dir', opts.css);
        options.push('--sass-dir', opts.sass);
        options.push('--images-dir', opts.img);
    }

    var compass = spawn(compassExecutable, options, {cwd: opts.project});
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