var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var usemin = require('gulp-usemin');
var jshint = require('gulp-jshint');
var jsxcs = require('gulp-jsxcs');
var stylish = require('jshint-stylish');
var to5 = require('gulp-6to5'); // this also handles JSX transform
var packageJSON  = require('./package');
var jshintConfig = packageJSON.jshintConfig;
var react = require('gulp-react');
var cache = require('gulp-cached');

function errHandle(err) {
  gutil.log('OOPS', gutil.colors.red(err.message));
  gutil.beep();
  this.emit('end');
};

var PATH = {
  SOURCE: './src/',
  DIST: './',
  BUILD: './build/'
};

var SOURCE = {
  IMAGES: PATH.SOURCE + 'img/*.*',
  STYLESHEETS: PATH.SOURCE + 'css/*.scss',
  SCRIPTS: PATH.SOURCE + 'js/**/*.js',
  ROOT_FILES: PATH.SOURCE + '*.*'
};

var development = true;
var dist = false;

gulp.task('clean', function(cb) {
  return del([
    PATH.BUILD
  ], cb);
});

gulp.task('copyRoot', function() {
  return gulp.src(SOURCE.ROOT_FILES)
    .pipe(gulp.dest(PATH.BUILD));
});

gulp.task('copyRootDist', function() {
  return gulp.src([
      PATH.BUILD + '*.*',
      '!' + PATH.BUILD + 'index.html'
    ])
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('img', function() {
  return gulp.src(SOURCE.IMAGES)
    .pipe(gulp.dest(PATH.BUILD + 'img/'));
});

gulp.task('imgDist', function() {
  return gulp.src(PATH.BUILD + 'img/*.*')
    .pipe(gulp.dest(PATH.DIST + 'img/'));
});

gulp.task('css', function () {
  return gulp.src(SOURCE.STYLESHEETS)
    .pipe(sass()).on('error', errHandle)
    .pipe(gulp.dest(PATH.BUILD + 'css/'));
});

gulp.task('jshint', function() {
  return gulp.src(SOURCE.SCRIPTS)
    .pipe(react()).on('error', errHandle)
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter(stylish));
});

gulp.task('jsxcs', function() {
  return gulp.src(SOURCE.SCRIPTS)
    .pipe(jsxcs({
      'validateIndentation': 2
    }));
});

gulp.task('es6to5', function() {
  return gulp.src(SOURCE.SCRIPTS)
    .pipe(to5()).on('error', errHandle)
    .pipe(gulp.dest(PATH.BUILD + 'js/es5'));
});

gulp.task('cleanJs', function(cb) {
  return del([PATH.BUILD + 'js/es5/'], cb);
});

gulp.task('browserify', ['es6to5'], function() {
  return browserify({
      entries: [PATH.BUILD + 'js/es5/main.js'],
      debug: development
    })
    .bundle().on('error', errHandle)
    .pipe(source('js/main.js'))
    .pipe(gulp.dest(PATH.BUILD));
});

gulp.task('js', function(cb) {
  return runSequence(
    'jshint',
    'jsxcs',
    'browserify',
    'cleanJs',
    cb);
});

gulp.task('usemin', function() {
  return gulp.src(PATH.BUILD + 'index.html')
    .pipe(usemin({
      css: [minifyCss()],
      html: [minifyHtml({empty: true})],
      js: [uglify()]
    }))
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('watch', function() {
  gulp.watch(SOURCE.STYLESHEETS, ['css']);
  gulp.watch(SOURCE.SCRIPTS, ['js']);
  gulp.watch(SOURCE.ROOT_FILES, ['copyRoot']);
});

gulp.task('build', function(cb) {
  development = dist ? false : true;
  return runSequence(
    'clean',
    'copyRoot',
    'img',
    'css',
    'js',
    cb);
});

gulp.task('dist', function(cb) {
  dist = true;
  return runSequence(
    'build',
    'usemin',
    'copyRootDist',
    'imgDist',
    cb);
});
