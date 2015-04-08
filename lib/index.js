'use strict';

var fs = require('fs'),
  compass = require('./compass'),
  through = require('through2'),
  gutil = require('gulp-util'),
  path = require('path');

// Consts
var PLUGIN_NAME = 'gulp-compass';

module.exports = function(opt) {
  var files = [],
      fileNames = [];

  var collectNames = function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if (path.basename(file.path)[0] === '_') {
      return cb();
    }

    files.push(file);
    fileNames.push(file.path);
    cb();
  };

  var compile = function(cb) {
    var self = this;
    compass(fileNames, opt, function(code, stdout, stderr, pathsToCss, options) {
      if (code === 127) {
        return cb(new gutil.PluginError(PLUGIN_NAME, 'You need to have Ruby and Compass installed ' +
          'and in your system PATH for this task to work.'));
      }

      // support error callback
      if (code !== 0) {
        return cb(new gutil.PluginError(PLUGIN_NAME, stdout || 'Compass failed'));
      }

      var i,
          processed = 0;

      var readFileAndPush = function(file, pathToCss) {
        file.contents = null;
        file.path = pathToCss;

        fs.readFile(file.path, function (err, contents) {
          if (err) {
            return cb(new gutil.PluginError(PLUGIN_NAME, 'Failure reading in the CSS output file'));
          }

          // Fix garbled output.
          if (!(contents instanceof Buffer)) {
            contents = new Buffer(contents);
          }

          file.contents = contents;
          self.push(file);
          processed++;
          if(processed === files.length) {
            cb();
          }
        });
      };

      for ( i = 0; i < files.length ; i++ ) {
        readFileAndPush(files[i], pathsToCss[i]);
      }
    });
  };

  return through.obj(collectNames, compile);
};
