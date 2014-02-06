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
        this.timeout(60000);
        var process = 0, timer, name_list = [];
        before(function(done){
            compass(path.join(__dirname, 'sass/compile.scss'), {
                project: __dirname,
                output_style: 'compressed',
                css_dir: 'css',
                sass_dir: 'sass',
                logging: false
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile scss error');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.relative(__dirname, new_path).replace(/\\/g, '/'));
                process += 1;
            });

            compass(path.join(__dirname, 'sass/simple.sass'), {
                project: __dirname,
                output_style: 'compressed',
                css_dir: 'css',
                sass_dir: 'sass',
                logging: false
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile sass error');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.relative(__dirname, new_path).replace(/\\/g, '/'));
                process += 1;
            });

            compass(path.join(__dirname, 'sass/base/compile.scss'), {
                project: __dirname,
                config_file: path.join(__dirname, 'config.rb')
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile scss error with config.rb file');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.relative(__dirname, new_path).replace(/\\/g, '/'));
                process += 1;
            });

            compass(path.join(__dirname, 'sass/import.scss'), {
                project: __dirname,
                output_style: 'compressed',
                import_path: 'bower_components'
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile scss error with import.scss file');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.relative(__dirname, new_path).replace(/\\/g, '/'));
                process += 1;
            });

            compass(path.join(__dirname, 'sass/require.scss'), {
                project: __dirname,
                output_style: 'compressed',
                require: 'susy'
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile scss error with require.scss file');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.relative(__dirname, new_path).replace(/\\/g, '/'));
                process += 1;
            });

            compass(path.join(__dirname, 'sass/spriting.scss'), {
                project: __dirname,
                output_style: 'compressed',
                css_dir: 'css',
                sass_dir: 'sass',
                images_dir: 'images',
                relative_assets: true
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile scss error with spriting.scss file');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.relative(__dirname, new_path).replace(/\\/g, '/'));
                process += 1;
            });

            compass(path.join(__dirname, 'sass/generated_images_dir_spriting.scss'), {
                project: __dirname,
                output_style: 'compressed',
                css_dir: 'css',
                sass_dir: 'sass',
                images_dir: 'images',
                generated_images_dir: 'images/generated',
                relative_assets: true
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile scss error with spriting.scss file and generated_images_dir');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.relative(__dirname, new_path).replace(/\\/g, '/'));
                process += 1;
            });

            compass(path.join(__dirname, 'sass/multiple-require.scss'), {
                project: __dirname,
                output_style: 'compressed',
                require: ['susy', 'breakpoint']
            }, function(code, stdout, stderr, new_path){
                if (+code !== 0) {
                    throw new Error('compile scss error with multiple require.scss file');
                }
                new_path = gutil.replaceExtension(new_path, '.css');
                name_list.push(path.relative(__dirname, new_path).replace(/\\/g, '/'));
                process += 1;
            });

            timer = setInterval(function(){
                if (process === 8) {
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

        it('test releate path with config.rb config', function() {
            var actual, expected;

            actual = read_file(path.join(__dirname, 'css/base/compile.css'));
            expected = read_file(path.join(__dirname, 'expected/compile.css'));
            actual.should.equal(expected);
        });

        it('test import_path option', function() {
            var actual, expected;

            actual = read_file(path.join(__dirname, 'css/import.css'));
            expected = read_file(path.join(__dirname, 'expected/import.css'));
            actual.should.equal(expected);
        });

        it('test require option', function() {
            var actual, expected;

            actual = read_file(path.join(__dirname, 'css/require.css'));
            expected = read_file(path.join(__dirname, 'expected/require.css'));
            actual.should.equal(expected);
        });

        it('test spriting with compass', function() {
            var actual, expected;

            actual = read_file(path.join(__dirname, 'css/spriting.css'));
            expected = read_file(path.join(__dirname, 'expected/spriting.css'));
            actual.should.equal(expected);
        });

        it('test spriting with compass and generated images dir', function() {
            var actual, expected;

            actual = read_file(path.join(__dirname, 'css/generated_images_dir_spriting.css'));
            expected = read_file(path.join(__dirname, 'expected/generated_images_dir_spriting.css'));
            actual.should.equal(expected);
        });

        it('test multiple require option', function() {
            var actual, expected;

            actual = read_file(path.join(__dirname, 'css/multiple-require.css'));
            expected = read_file(path.join(__dirname, 'expected/multiple-require.css'));
            actual.should.equal(expected);
        });

        it('output path test array', function() {
            var expected = ['css/base/compile.css', 'css/compile.css', 'css/generated_images_dir_spriting.css', 'css/import.css', 'css/multiple-require.css', 'css/require.css', 'css/simple.css', 'css/spriting.css'];
            name_list.sort().should.eql(expected);
        });

    });
});
