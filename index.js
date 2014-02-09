'use strict';

var fs = require('fs'),
    compass = require('./lib/compass'),
    through = require('through2'),
    gutil = require('gulp-util');

// Consts
var PLUGIN_NAME = 'gulp-compass';

module.exports = function(opt) {
    var compile = function(file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        compass(file.path, opt, function(code, stdout, stderr, path) {
            if (code === 127) {
                this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'You need to have Ruby and Compass installed ' +
                    'and in your system PATH for this task to work. '));
                return cb();
            }
            if (code === 42) {
                // This is a partial, just drop it
                return cb();
            }

            // support error callback
            if (code !== 0) {
                this.emit('error', new gutil.PluginError(PLUGIN_NAME, stdout));
                return cb();
            }

            // excute callback
            file.path = gutil.replaceExtension(file.path, '.css');
            file.contents = new Buffer(fs.readFileSync(String(gutil.replaceExtension(path, '.css'))));
            this.push(file);
            return cb();
        }.bind(this));
    };

    return through.obj(compile);
};
