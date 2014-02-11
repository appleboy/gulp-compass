# Gulp compass [![NPM version](https://badge.fury.io/js/gulp-compass.png)](http://badge.fury.io/js/gulp-compass) [![Build Status](https://travis-ci.org/appleboy/gulp-compass.png?branch=master)](https://travis-ci.org/appleboy/gulp-compass)

[![NPM](https://nodei.co/npm/gulp-compass.png?downloads=true&stars=true)](https://nodei.co/npm/gulp-compass/)

> Compile Sass to CSS using Compass

## Requirements

`gulp-compass` requires the compass ruby gem in order to compile compass. This can easily be installed via Terminal.

```
$ gem update --system
$ gem install compass
```

Please refer the [user guide](http://compass-style.org/install/)

## Installation

Install with [npm](https://npmjs.org/package/gulp-compass)

```
$ npm install gulp-compass --save-dev
```

## Usage

Either, load your compass ``config.rb`` file, or configure the project by providing an object.

```javascript
var compass = require('gulp-compass');

gulp.task('compass', function() {
    gulp.src('./src/*.scss')
        .pipe(compass({
            config_file: './config.rb'
        }))
        .pipe(gulp.dest('app/assets/temp'));
});
```

Use an object to configure your project.

```javascript
var compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css');

gulp.task('compass', function() {
    gulp.src('./src/*.scss')
        .pipe(compass({
            css_dir: 'stylesheets',
            line_comments: false
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/assets/temp'));
});
```

Set your project path.

```javascript
var compass = require('gulp-compass'),
    path = require('path');

gulp.task('compass', function() {
    gulp.src('./src/*.scss')
        .pipe(compass({
            project_path: path.join(__dirname, 'assets'),
            css_dir: 'css',
            sass_dir: 'sass'
        }))
        .pipe(gulp.dest('app/assets/temp'));
});
```

## Configuration

#### config_file

Type: `String`
Default: `false`

Your compass ``config.rb`` file. Using this assumes you'll do all project specific configuration in that file, thus ``logging`` and ``project`` are the only configuration options that will be read.

#### output_style

Type: `String`
Default: `nested`

The output style for the compiled css. One of: ``nested``, ``expanded``, ``compact``, or ``compressed``.

#### line_comments

Type: `Boolean`
Default: `true`

Indicates whether line comments should be added to compiled css that says where the selectors were defined.

#### relative_assets

Type: `Boolean`
Default: `true`

Indicates whether the compass helper functions should generate relative urls from the generated css to assets, or absolute urls using the http path for that asset type.

#### css_dir

Type: `String`
Default: `css`

The target directory where you keep your css stylesheets. It is relative to the ``project_path`` option.

#### sass_dir

Type: `String`
Default: `sass`

The source directory where you keep your sass stylesheets. It is relative to the ``project_path`` option.

#### javascripts_dir

Type: `String`
Default: `javascripts`

The directory where you keep your javascripts. It is relative to the ``project_path`` option.

#### fonts_dir

Type: `String`
Default: `fonts`

The directory where you keep your fonts. It is relative to the ``project_path`` option.

#### generated_images_dir

Type: `String`
Default: `images`

The directory where generated images are kept. It is relative to the ``project_path`` option.

#### project_path

Type: `String`
Default: Your project path

Sets the path to the root of the project.

#### logging

Type: `Boolean`
Default: `true`

Show/hide compile log message.

#### import_path

Type: `String`
Default: `false`

The directory where you keep external Compass plugins or extensions that you would like to make available using the `@import` function. Common use case would be setting this to your `bower_components` directory for example. It is relative to the ``project_path`` option.

#### require

Type: `String | Array`
Default: `false`

Require the given Ruby library before running commands. This is used to access Compass plugins without having a project configuration file.

## Running tests

```
$ gem install susy
$ gem install breakpoint
$ npm install
$ npm test
```
