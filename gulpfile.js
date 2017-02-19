'use strict';

var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var config = {
    environment: 'production',
    development: {
        lint: true,
        minify: false,
        sourcemaps: true
    },
    production: {
        lint: false,
        minify: true,
        sourcemaps: false
    },
    scripts: {
        destDirectory: './scripts',
        destFileName: 'site.js',
        source: './src/scripts/site.js',
        vendor: {
            source: [
                './src/scripts/vendor/oculo.min.js',
                './src/scripts/vendor/prettify.js',
                './src/scripts/vendor/Draggable.min.js',
                './src/scripts/vendor/ScrollToPlugin.js',
                './src/scripts/vendor/TweenMax.min.js'
            ]
        }
    },
    styles: {
        destDirectory: './styles',
        paths: [
            './src/styles', 
            './node_modules/foundation-sites/scss',
            './node_modules/normalize-scss/sass'
        ],
        source: './src/styles/site.scss'
    }
};

if (config.environment === 'production') {
    process.env.NODE_ENV = config.environment;
}

// set up default task
gulp.task('default', ['build']);

gulp.task('build', ['compile:styles', 'compile:scripts'], function () {
    return;
});

gulp.task('clean:scripts', function () {
    return del(config.scripts.destDirectory);
});

gulp.task('clean:styles', function () {
    return del(config.styles.destDirectory);
});

gulp.task('copy:vendor:scripts', ['clean:scripts'], function () {
    return gulp.src(config.scripts.vendor.source)
        .pipe(gulp.dest(config.scripts.destDirectory));
});

gulp.task('compile:scripts', ['clean:scripts', 'copy:vendor:scripts'], function () {
    return browserify(config.scripts.source, { 
            debug: config[config.environment].sourcemaps,
            transform: babelify
        })
        .bundle()
        .on('error', function (error) { 
            console.log('Error: ' + error.message); 
        })
        .pipe(source(config.scripts.destFileName))
        
        // Minify
        .pipe(buffer())
        .pipe(gulpif(config[config.environment].minify, uglify()))
        .pipe(gulpif(config[config.environment].minify, rename({suffix: '.min'})))
        .pipe(gulp.dest(config.scripts.destDirectory));
});

gulp.task('compile:styles', ['clean:styles'], function () {
    return gulp.src(config.styles.source)
        .pipe(sass({
            includePaths: config.styles.paths,
            outputStyle: config[config.environment].minify ? 'compressed' : 'expanded'
        }).on('error', sass.logError))
        .pipe(gulpif(config[config.environment].minify, rename({suffix: '.min'})))
        .pipe(gulp.dest(config.styles.destDirectory));
});