'use strict';

var babelify = require('babelify');
var babelRegister = require('babel-register');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var childProcess = require('child_process');
var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var lint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var config = {
    environment: 'production',
    development: {
        minify: false,
        sourcemaps: true
    },
    production: {
        minify: true,
        sourcemaps: false
    },
    scripts: {
        destDirectory: './dist',
        destFileName: 'oculo.js',
        source: './src/scripts/oculo.js'
    },
    tests: {
        source: './tests/*.js'
    },
    vendor: {
        dest: ['./dist/TweenMax.min.js', './dist/Draggable.min.js'],
        source: ['./node_modules/gsap/src/minified/TweenMax.min.js', './node_modules/gsap/src/minified/utils/Draggable.min.js']
        
    }
};

var docs = {
    destDirectory: './docs'
};

if (config.environment === 'production') {
    process.env.NODE_ENV = config.environment;
}

// set up default task
gulp.task('default', ['build']);

gulp.task('build', ['compile:scripts'], function () {
    return;
});

gulp.task('clean:docs', function () {
    return del(docs.destDirectory);
});

gulp.task('clean:scripts', function () {
    return del(config.scripts.destDirectory);
});

gulp.task('copy:vendor', ['clean:scripts'], function () {
    return gulp.src(config.vendor.source)
        .pipe(gulp.dest(config.scripts.destDirectory));
});

gulp.task('compile:scripts', ['clean:scripts', 'copy:vendor', 'lint:scripts'], function () {
    return browserify(config.scripts.source, { 
            debug: config[config.environment].sourcemaps,
            standalone: 'Oculo',
            transform: babelify
        })
        .bundle()
        .on('error', function (error) { 
            console.log('Error: ' + error.message); 
        })
        .pipe(source(config.scripts.destFileName))
        .pipe(buffer())
        .pipe(gulp.dest(config.scripts.destDirectory))
    
        // Minify
        //.pipe(buffer())
        .pipe(gulpif(config[config.environment].minify, uglify()))
        .pipe(gulpif(config[config.environment].minify, rename({suffix: '.min'})))
        .pipe(gulpif(config[config.environment].minify, gulp.dest(config.scripts.destDirectory)));
});

gulp.task('generate:docs', ['clean:docs'], function () {
	childProcess.exec('./node_modules/jsdoc/jsdoc.js -c jsdocconfig.json');
});

gulp.task('lint:scripts', () => {
    return gulp.src(['./src/scripts/*.js','!node_modules/**'])
        .pipe(lint())
        .pipe(lint.format())
        .pipe(lint.failAfterError());
});

gulp.task('test:scripts', function () {
	return gulp.src(config.tests.source)
		.pipe(mocha({
            compilers: {
                js: babelRegister
            },
            reporter: 'nyan'
        })
        // HACK: process hangs when GSAP is imported in a test
        .once('end', function () {
          process.exit();
        }));
});