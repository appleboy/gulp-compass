'use strict';
var fs = require('fs'),
    compass = require('../lib/compass'),
    should = require('should'),
    path = require('path'),
    grunt = require('grunt');

require('mocha');

describe('gulp-compass', function() {
    describe('compass()', function() {
        before(function(done){
            // set time out
            this.timeout(5000);

            compass(path.join(__dirname, 'sass/compile.scss'), {
                project: __dirname,
                style: 'compressed',
                css: 'css',
                sass: 'sass'
            });

            compass(path.join(__dirname, 'sass/simple.sass'), {
                project: __dirname,
                style: 'compressed',
                css: 'css',
                sass: 'sass'
            });

            setTimeout(function(){
                // wait compass compile css time
                done();
            }, 2000);
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
