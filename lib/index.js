'use strict';

var fs = require('fs');
var compass = require('./compass');
var callCounter = require('./callCounter');
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var source = require('vinyl-source-stream');
var eventStream = require('event-stream');

// Consts
var PLUGIN_NAME = 'gulp-compass';

module.exports = function(opt) {
  var files = [];

  var collectNames = function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if (path.basename(file.path)[0] !== '_') {
      files.push(file);
    }

    return cb();
  };

  var readFileAndPush = function(pathToCss, outputStream, cb) {
    // Read each generated file so it can continue being streamed.
    fs.readFile(pathToCss, function(err, contents) {
      if (err) {
        return cb(new gutil.PluginError(PLUGIN_NAME, 'Failure reading in the CSS output file'));
      }

      // Fix garbled output.
      if (!(contents instanceof Buffer)) {
        contents = new Buffer(contents);
      }

      outputStream.push(new gutil.File({
        base: opt.css,
        path: pathToCss,
        contents: contents
      }));

      cb();
    });
  };

  var compile = function(cb) {
    var _this = this;
    var fileNames = files.map(function(f) {
      return f.path;
    });

    compass(fileNames, opt, function(code, stdout, stderr, pathsToCss, options) {
      if (code === 127) {
        return cb(new gutil.PluginError(PLUGIN_NAME, 'You need to have Ruby and Compass installed ' +
          'and in your system PATH for this task to work.'));
      }

      // support error callback
      if (code !== 0) {
        return cb(new gutil.PluginError(PLUGIN_NAME, stdout || 'Compass failed'));
      }

      cb = callCounter(files.length, cb);
      pathsToCss.forEach(function(f) {
        readFileAndPush(f, _this, cb);
      });
    });
  };

  return through.obj(collectNames, compile);
};

/**
 * Run compass on single sass files as they come down the stream.
 *
 * The gulp-compass plugin collects all files and runs compass on them when the
 * stream is over, but the stream is never over when watching.
 */
module.exports.singleFile = function(opt) {

  return eventStream.map(function(file, callback) {

    var result;

    var stream = source(file.relative)
      .pipe(module.exports(opt))
      .on('data', function(data) {
        result = data;
      })
      .on('end', function() {
        callback(null, result);
      });

    stream.write(file);

    stream.end();

  });

};
