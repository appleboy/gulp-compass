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

load your compass ``config.rb`` file. Please make sure ``css_dir`` and ``sass_dir`` value on ``config.rb`` file.

* ``css_dir`` default value is ``css``.
* ``sass_dir`` default value is ``sass``.

if ``css_dir`` value is ``stylesheets``, please add ``css`` key as your define.

```javascript
var compass = require('gulp-compass');

gulp.task('compass', function() {
    gulp.src('./src/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: 'stylesheets'
        }))
        .pipe(gulp.dest('app/assets/temp'));
});
```

set your project path.

```javascript
var compass = require('gulp-compass'),
    path = require('path');

gulp.task('compass', function() {
    gulp.src('./src/*.scss')
        .pipe(compass({
            project: path.join(__dirname, 'assets'),
            css: 'css',
            sass: 'sass'
        }))
        .pipe(gulp.dest('app/assets/temp'));
});
```

set your compass settings.

```javascript
var compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css');

gulp.task('compass', function() {
    gulp.src('./src/*.scss')
        .pipe(compass({
            css: 'app/assets/css',
            sass: 'app/assets/sass',
            image: 'app/assets/images'
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/assets/temp'));
});
```

Support multiple require option

```javascript
var compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css');

gulp.task('compass', function() {
    gulp.src('./src/*.scss')
        .pipe(compass({
            css: 'app/assets/css',
            sass: 'app/assets/sass',
            image: 'app/assets/images',
            require: ['susy', 'modular-scale']
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/assets/temp'));
});
```

Support return the output of the Compass as the callback

```javascript
var compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css');

gulp.task('compass', function() {
    gulp.src('./src/*.scss')
        .pipe(compass({
            css: 'app/assets/css',
            sass: 'app/assets/sass',
            image: 'app/assets/images'
        }))
        .on('error', function(err) {
            // Would like to catch the error here
        })
        .pipe(minifyCSS())
        .pipe(gulp.dest('app/assets/temp'));
});
```

## Configuration

### Configuration Options

#### style

**default:** nested

**description:** The output style for the compiled css.
One of: nested, expanded, compact, or compressed.

#### comments

**default:** true

**description:** Show line comments or not.

#### relative

**default:** true

**description:** Are assets relative.

#### css

**default:** css

**description:** The target directory where you keep your css stylesheets. It is relative to the ``project`` option.

#### sass

**default:** sass

**description:** The source directory where you keep your sass stylesheets. It is relative to the ``project`` option.

#### javascript

**default:** js

**description:** The directory where you keep your javascripts. It is relative to the ``project`` option.


#### font

**default:** font

**description:** The directory where you keep your fonts. It is relative to the ``project`` option.

#### project

**default:** your project base

**description:** The location where all your assets are store.

#### logging

**default:** true

**description:** show/hide compile log message.

#### import_path

**default:** false

**description:** The directory where you keep external Compass plugins or extensions that you would like to make available using the `@import` function. Common use case would be setting this to your `bower_components` directory for example. It is relative to the ``project`` option.

#### require

**default:** false

**format:** ``string`` or ``array``

**description:** Require the given Ruby library before running commands. This is used to access Compass plugins without having a project configuration file.

#### load_all

**default:** false

**description:** Load all the frameworks or extensions found in the FRAMEWORKS_DIR directory.

#### bundle_exec

**default:** false

**description:** Run compass compile with [bundle exec](http://bundler.io/v1.5/man/bundle-exec.1.html): ``bundle exec compass compile``.

## Running tests

```
$ gem install sass
$ gem install compass
$ gem install susy
$ gem install modular-scale
$ npm test
```
