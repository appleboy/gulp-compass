'use strict';

var which = require('which').sync;
var isWindows = process.platform === 'win32' ||
  process.env.OSTYPE === 'cygwin' ||
  process.env.OSTYPE === 'msys';
var COLON = isWindows ? ';' : ':'

module.exports.isArray = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

module.exports.command = function(cmd, env_path,callback) {
  var command;
  var opt;
  if(env_path.length>0){
    opt = {
      path:env_path.join(COLON)
    }
  }
  try {
    command = which(cmd, opt);
  } catch (err) {

    if (callback) {
      callback(127, '', String(err), '');
    }

    return false;
  }

  return command;
};
