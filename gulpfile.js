// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['./src/igLogin.module.js', './src/igLogin*.js'])
        .pipe(concat('igLogin.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('igLogin.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});


// Default Task
gulp.task('default', ['lint',  'scripts']);