'use strict';
var fs = require('fs'),
    compass = require('../lib/compass'),
    should = require('should'),
    path = require('path'),
    iconv = require('iconv-lite');

require('mocha');

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

describe('gulp-compass', function() {
    describe('compass()', function() {
        var process = 0, timer;
        before(function(done){
            compass('sass/compile.scss', {
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

            compass('sass/simple.sass', {
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

            actual = read_file(path.join(__dirname, 'css/compile.css'));
            expected = read_file(path.join(__dirname, 'expected/compile.css'));
            actual.should.equal(expected);

            actual = read_file(path.join(__dirname, 'css/simple.css'));
            expected = read_file(path.join(__dirname, 'expected/simple.css'));
            actual.should.equal(expected);
        });
    });
});
