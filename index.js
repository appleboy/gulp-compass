'use strict';

var fs = require('fs'),
  compass = require('./lib/compass'),
  through = require('through2'),
  gutil = require('gulp-util'),
  path = require('path');

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

    if (path.basename(file.path)[0] === '_') {
      return cb();
    }

    compass(file.path, opt, function(code, stdout, stderr, path) {
      if (code === 127) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'You need to have Ruby and Compass installed ' +
          'and in your system PATH for this task to work. '));
        return cb();
      }

      // support error callback
      if (code !== 0) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, stdout || 'Compass failed'));
        return cb();
      }

      // excute callback
      var pathToCss = gutil.replaceExtension(path, '.css'),
        contents = fs.readFileSync(pathToCss);

      // Fix garbled output.
      if (!(contents instanceof Buffer)) {
        contents = new Buffer(contents);
      }

      file.path = gutil.replaceExtension(file.path, '.css');
      file.contents = contents;
      this.push(file);
      cb();
    }.bind(this));
  };

  return through.obj(compile);
};
