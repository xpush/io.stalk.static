var gulp = require('gulp');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var rimraf = require('rimraf');

gulp.task('clean', function (cb) {
  rimraf('build/', cb);
});

/** STALK **/
var stalk_paths = {
  scripts: [
    'src/json2.js',
    'node_modules/socket.io-client/socket.io.js',
    'src/stalk/stalk.js'
  ],
  styles: 'src/stalk/**/*.css',
  images: 'src/stalk/**/*.png'
};

gulp.task('stalk_scripts', [], function () {
  return gulp.src(stalk_paths.scripts)
    .pipe(uglify())
    .pipe(concat('stalk.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('stalk_styles', [], function () {
  return gulp.src(stalk_paths.styles)
    .pipe(minify({keepSpecialComments: false, noAdvanced: true}))
    .pipe(concat('stalk.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('stalk_images', [], function () {
  return gulp.src(stalk_paths.images)
    .pipe(gulp.dest('build/images'));
});

/** WIDGET **/
var widget_paths = {
  scripts: [
    'src/json2.js',
    'node_modules/socket.io-client/socket.io.js',
    'src/widget/widget.js'
  ],
  styles: 'src/widget/**/*.css',
  images: 'src/widget/**/*.png'
};

gulp.task('widget_scripts', [], function () {
  return gulp.src(widget_paths.scripts)
    //.pipe(uglify())
    .pipe(concat('widget.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('widget_styles', [], function () {
  return gulp.src(widget_paths.styles)
    .pipe(minify({keepSpecialComments: false, noAdvanced: true}))
    .pipe(concat('widget.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('widget_images', [], function () {
  return gulp.src(widget_paths.images)
    .pipe(gulp.dest('build/images'));
});


gulp.task('move', [], function () {
  return gulp.src('build/**/*')
    .pipe(gulp.dest('www'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(stalk_paths.scripts, ['stalk_scripts', 'move']);
  gulp.watch(stalk_paths.styles, ['stalk_styles', 'move']);
  gulp.watch(stalk_paths.images, ['stalk_images', 'move']);
  gulp.watch(widget_paths.scripts, ['widget_scripts', 'move']);
  gulp.watch(widget_paths.styles, ['widget_styles', 'move']);
  gulp.watch(widget_paths.images, ['widget_images', 'move']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('stalk', function (cb) {

  runSequence('clean',
    ['stalk_scripts', 'stalk_styles', 'stalk_images'],
    'move',
    cb);

});

gulp.task('widget', function (cb) {

  runSequence('clean',
    ['widget_scripts', 'widget_styles', 'widget_images'],
    'move',
    cb);

});
