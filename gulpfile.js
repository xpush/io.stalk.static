var gulp = require('gulp');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

var rimraf = require('rimraf');

var paths = {
  scripts: [
    'src/stalk.js',
    'src/json2.js',
    'node_modules/socket.io-client/socket.io.js'
  ],
  styles: 'src/**/*.css',
  images: 'src/**/*.png'
};

gulp.task('clean', function(cb){
  rimraf('build/', cb);
});

gulp.task('scripts', [], function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('stalk.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('styles', [], function() {
 return gulp.src(paths.styles)
    .pipe(minify({keepSpecialComments: false, noAdvanced: true}))
    .pipe(concat('stalk.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('images', [], function() {
 return gulp.src(paths.images)
    .pipe(gulp.dest('build'));
});

gulp.task('move', [], function() {
 return gulp.src('build/**/*')
    .pipe(gulp.dest('www'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['clean', 'scripts', 'move']);
  gulp.watch(paths.styles,  ['clean', 'styles',  'move']);
  gulp.watch(paths.images,  ['clean', 'images',  'move']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', function(cb){

  runSequence('clean',
              ['scripts', 'styles', 'images'],
              'move',
              cb);

});
