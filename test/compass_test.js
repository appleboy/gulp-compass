'use strict';
var fs = require('fs');
var gutil = require('gulp-util');
var compass = require('../lib/compass');
var should = require('should');
var path = require('path');
require('mocha');

describe('gulp-compass', function() {
    describe('compass()', function() {
        it('compile scss to css', function() {
            console.log(process.cwd() + ' ' + __dirname);
            compass(path.join(__dirname, 'sass/compile.scss'), {
                project: __dirname,
                css: 'css2',
                sass: 'sass'
            });
            //done();
        });
    });
});
