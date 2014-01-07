'use strict';
var fs = require('fs'),
    compass = require('../lib/compass'),
    path = require('path'),
    gutil = require('gulp-util'),
    iconv = require('iconv-lite');

require('mocha');
require('should');

var read_file = function(filepath) {
    var contents;
    try {
        contents = fs.readFileSync(String(filepath));
        contents = iconv.decode(contents, 'utf-8');
        // Strip any BOM that might exist.
        if (contents.charCodeAt(0) === 0xFEFF) {
            contents = contents.substring(1);
        }
        return contents;
    } catch(e) {
        throw new Error('Unable to read "' + filepath + '" file');
    }
};

describe('gulp-compass plugin', function() {
    describe('compass()', function() {
        var process = 0, timer, name_list = [];
        before(function(done){
            compass('sass/compile.scss', {
                project: __dirname,
                style: 'compressed',
                css: 'css',
                sass: 'sass',
                logging: false
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile scss error');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.basename(new_path));
                process += 1;
            });

            compass('sass/simple.sass', {
                project: __dirname,
                style: 'compressed',
                css: 'css',
                sass: 'sass',
                logging: false
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile sass error');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.basename(new_path));
                process += 1;
            });

            timer = setInterval(function(){
                if (process === 2) {
                    clearInterval(timer);
                    done();
                }
            }, 100);
        });

        it('compile scss to css', function() {
            var actual, expected;

            actual = read_file(path.join(__dirname, 'css/compile.css'));
            expected = read_file(path.join(__dirname, 'expected/compile.css'));
            actual.should.equal(expected);
        });

        it('compile sass to css', function() {
            var actual, expected;

            actual = read_file(path.join(__dirname, 'css/simple.css'));
            expected = read_file(path.join(__dirname, 'expected/simple.css'));
            actual.should.equal(expected);
        });

        it('output path test array', function() {
            var expected = ['compile.css', 'simple.css'];
            name_list.sort().should.eql(expected);
        });
    });
});
