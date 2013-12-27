'use strict';
var fs = require('fs'),
    compass = require('../lib/compass'),
    should = require('should'),
    path = require('path'),
    grunt = require('grunt');

require('mocha');

describe('gulp-compass', function() {
    describe('compass()', function() {
        var process = 0, timer;
        before(function(done){
            compass(path.join(__dirname, 'sass/compile.scss'), {
                project: __dirname,
                style: 'compressed',
                css: 'css',
                sass: 'sass'
            }, function(code, stdout, stderr){
                if (code != 0) {
                    throw new Error('compile scss error');
                }
                process += 1;
            });

            compass(path.join(__dirname, 'sass/simple.sass'), {
                project: __dirname,
                style: 'compressed',
                css: 'css',
                sass: 'sass'
            }, function(code, stdout, stderr){
                if (code != 0) {
                    throw new Error('compile sass error');
                }
                process += 1;
            });

            timer = setInterval(function(){
                if (process == 2) {
                    clearInterval(timer);
                    done();
                }
            }, 100);
        });

        it('compile scss to css', function() {
            var actual, expected;

            actual = grunt.file.read(path.join(__dirname, 'css/compile.css'));
            expected = grunt.file.read(path.join(__dirname, 'expected/compile.css'));
            actual.should.equal(expected);

            actual = grunt.file.read(path.join(__dirname, 'css/simple.css'));
            expected = grunt.file.read(path.join(__dirname, 'expected/simple.css'));
            actual.should.equal(expected);
        });
    });
});
