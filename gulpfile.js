'use strict';

var gulp            = require('gulp'),

    // SASS compiler
    sass            = require('gulp-sass'),

    // Used to automatically add in css browser prefixes so we can just write lovely CSS3 without worrying
    autoprefixer    = require('gulp-autoprefixer'),

    // Used to delete files
    del             = require('del'),

    // Used to replace the output of conditional HTML comments
    processhtml     = require('gulp-processhtml'),

    // Reports the filesize of the latest pipe to the terminal
    size            = require('gulp-filesize'),

    // Used to minify our compiled CSS
    mincss          = require('gulp-minify-css'),

    // Used for minifying javascript
    uglify          = require('gulp-uglify'),

    // Used for linting javascript and checking for issues
    jshint          = require('gulp-jshint'),

    // Used for modular javascript development
    browserify      = require('browserify'),

    // Use conventional text streams at the start of your gulp or vinyl pipelines
    source          = require('vinyl-source-stream'),

    // Converts streaming vinyl files to use buffers
    buffer          = require('vinyl-buffer'),

    // Used for generating sourcemaps of minified javascript files.
    sourcemaps      = require('gulp-sourcemaps'),

    // I'll be honest, I have no idea what this does.
    gutil           = require('gulp-util'),

    // Test-runner
    tape            = require('gulp-tape'),

    // Reporter used by the test runner
    tap             = require('tap-colorize'),

    // Used to output the file sizes
    size            = require('gulp-size'),

    // These are used to perform tasks differently depending on the args
    argv            = require('yargs').argv,
    gulpif          = require('gulp-if'),
    rename          = require('gulp-rename'),

    // These are used in the compilation of underscore templates
    lodash          = require('lodash'),
    template        = require('gulp-template-compile'),
    concat          = require('gulp-concat'),
    defmod          = require('gulp-define-module');


/**
 * Polyfill required so the autoprefixer doesn't break.
 */
require('es6-promise').polyfill();

gulp.task('views', function () {
    return gulp.src('./src/views/*.html')
        .pipe(template({ namespace: 'WAG'}))
        .pipe(concat('views.js'))
        .pipe(defmod('commonjs'))
        .pipe(gulp.dest('./src/scripts'));
});


/**
 * Bundle and minify all of the source script files
 */
gulp.task('scripts', ['jshint', 'views'], function () {

    return browserify({ entries: './src/scripts/app.js', noParse: ['./src/vendor/pixi.min.js'], debug: true })
        .bundle()
        .on('error', gutil.log)
        .pipe(source('wagamama.js'))
        .pipe(buffer())
        .pipe(size())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulpif(argv.production, rename({suffix: '.min'})))
        .pipe(gulpif(argv.production, sourcemaps.write('./')))
        .on('error', gutil.log)
        .pipe(size())
        // .pipe(gulp.dest('../backend/static_assets/scripts'));
        .pipe(gulp.dest('../backend/static_assets/scripts'));
});

/**
 * Separate gulp task for the competition closed script
 */
gulp.task('closed', ['jshint', 'views'], function () {

    return browserify({ entries: './src/scripts/closed.js', noParse: ['./src/vendor/pixi.min.js'], debug: true })
        .bundle()
        .on('error', gutil.log)
        .pipe(source('closed.js'))
        .pipe(buffer())
        .pipe(size())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulpif(argv.production, rename({suffix: '.min'})))
        .pipe(gulpif(argv.production, sourcemaps.write('./')))
        .on('error', gutil.log)
        .pipe(size())
        // .pipe(gulp.dest('../backend/static_assets/scripts'));
        .pipe(gulp.dest('../backend/static_assets/scripts'));
});


/**
 * This task is used to verify that I am not taking crazy pills
 * and that my javascript is in fact perfectly formed.
 */
gulp.task('jshint', function() {

    return gulp.src([
        './src/scripts/**/*.js',
        '!./src/scripts/views/**/*.*',
        '!./src/scripts/views.js',
        '!./src/scripts/generated/**/*.js',
        '!./src/scripts/Social.js',
        '!./src/scripts/Tracking.js',
        '!./src/scripts/tracking.js'
        ])
        .pipe(jshint(require('./config/jshint.js')))
        .pipe(jshint.reporter('default'));
});


/**
 * This task compiles, nay transforms my sass into a hard
 * shiny peg of truth (CSS). Compiles scss files for dev.
 * Minifies if this task is run with the production argument.
 */
gulp.task('sass', function() {

    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(argv.production, mincss()))
        .pipe(gulpif(argv.production, rename({suffix: '.min'})))
        // .pipe(gulp.dest('../backend/static_assets/css'));
        .pipe(gulp.dest('../backend/static_assets/css'));
});


/**
 * Run the TAPE tests
 */
gulp.task('test', function() {

    return gulp.src('./tests/tape/*.js')
        .pipe(tape({
            reporter: tap()
        }));
});


/**
 * EVERYTHING.
 */
gulp.task('build', ['jshint', 'sass', 'scripts']);

/**
 *  Watch our source files and trigger a build when they change
 */
gulp.task('watch', function() {

    gulp.watch([
        './src/scripts/**/*.js',
        './src/views/**/*.html',
        './src/scss/**'
    ], ['build']);
});
