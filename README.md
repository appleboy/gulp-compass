# gulp compass

Compile Sass to CSS using Compass

# Requirements

`gulp-compass` requires the compass ruby gem in order to compile compass. This can easily be installed via Terminal.

```
$ gem update --system
$ gem install compass
```

Please refer the [user guide](http://compass-style.org/install/)

# Installation

```
$ npm install gulp-compass --save-dev
```

# Usage

```
var compass = require('gulp-compass');

gulp.task('compass', function() {
  gulp.src('./src/*.scss')
    .pipe(compass())
});
```

