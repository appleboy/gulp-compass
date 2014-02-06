'use strict';

var spawn = require('child_process').spawn,
    gutil = require('gulp-util'),
    path = require('path'),
    which = require('which').sync,

    defaults = {
        output_style: 'nested',
        line_comments: true,
        relative_assets: true,

        css_dir: 'css',
        sass_dir: 'sass',
        images_dir: 'images',
        javascripts_dir: 'javascripts',
        fonts_dir: 'fonts',
        generated_images_dir: false,

        import_path: false,
        require: false,
        logging: true,

        config_file: false,

        project: process.cwd()
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
        relative_file_name = path.relative(path.join(opts.project || process.cwd(), opts.sass_dir), file);

    if (file_name.match(/^_/)) {
        if(callback){
            callback(42, '', '', '');
        }
        return;
    }

    // check command exist
    try {
        compassExecutable = which(compassExecutable);
    } catch (err) {
        if(callback){
            callback(127, '', String(err), '');
        }
        return;
    }

    var options = [];
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
        if (!opts.line_comments) { options.push('--no-line-comments'); }
        if (opts.relative_assets) { options.push('--relative-assets'); }

        options.push('--output-style', opts.output_style);
        options.push('--css-dir', opts.css_dir);
        options.push('--sass-dir', opts.sass_dir);
        options.push('--images-dir', opts.images_dir);
        options.push('--javascripts-dir', opts.javascripts_dir);
        options.push('--fonts-dir', opts.fonts_dir);

        if (opts.generated_images_dir) {
            options.push('--generated-images-path', opts.generated_images_dir);
        }

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
        new_path = path.join(opts.project, opts.css_dir, relative_file_name);
        if(callback){
            callback(code, stdout, stderr, new_path);
        }
    });
};
