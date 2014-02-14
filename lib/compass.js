'use strict';

var spawn = require('child_process').spawn,
    gutil = require('gulp-util'),
    path = require('path'),
    which = require('which').sync,
    defaults = {
        style: 'nested',
        comments: true,
        relative: true,
        css: 'css',
        sass: 'sass',
        image: 'images',
        javascript: 'js',
        font: 'font',
        import_path: false,
        config_file: false,
        require: false,
        logging: true,
        load_all: false,
        project: process.cwd(),
        bundle_exec: false
    },
    isArray = Array.isArray || function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

module.exports = function(file, opts, callback) {
    opts = opts || {};

    for (var key in defaults) {
        if (opts[key] === undefined) {
            opts[key] = defaults[key];
        }
    }

    var compassExecutable = 'compass',
        file_name = path.basename(file),
        file_path = file.replace(/\\/g, '/'),
        relative_file_name = path.relative(path.join(opts.project || process.cwd(), opts.sass), file);

    if (file_name.match(/^_/)) {
        if(callback){
            callback(42);
        }
        return;
    }

    // check command exist
    try {
        if (opts.bundle_exec) {
            compassExecutable = which('bundle');
        } else {
            compassExecutable = which(compassExecutable);
        }
    } catch (err) {
        if(callback){
            callback(127, '', String(err), '');
        }
        return;
    }

    var options = [];
    if (opts.bundle_exec) {
        options.push('exec', 'compass');
    }
    options.push('compile');
    if (process.platform === 'win32') {
        options.push(opts.project.replace(/\\/g, '/'));
    } else {
        options.push(opts.project);
    }
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
        options.push('--images-dir', opts.image);
        options.push('--javascripts-dir', opts.javascript);
        options.push('--fonts-dir', opts.font);
        if (opts.import_path) { options.push('-I', opts.import_path); }
        if (opts.load_all) { options.push('--load-all', opts.load_all); }
        if (opts.require) {
            if (isArray(opts.require)) {
                for (var i = 0, len = opts.require.length; i < len; i++) {
                    options.push('--require', opts.require[i]);
                }
            } else {
                options.push('--require', opts.require);
            }
        }
    }

    var child = spawn(compassExecutable, options, {cwd: opts.project || process.cwd()}),
        stdout = '',
        stderr = '';
    if (opts.logging) {
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function (data) {
            stdout += data;
            console.log(data);
        });

        child.stderr.setEncoding('utf8');
        child.stderr.on('data', function (data) {
            stderr += data;
            if (!data.match(/^\u001b\[\d+m$/)) {
                gutil.log(data);
            }
        });
    }

    // support callback
    child.on('close', function(code) {
        var new_path;
        new_path = path.join(opts.project, opts.css, relative_file_name);
        if(callback){
            callback(code, stdout, stderr, new_path);
        }
    });
};
