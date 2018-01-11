var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    minifyCss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    imageMin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    shellJS = require('shelljs'),
    path = require('path'),
    fs = require('fs'),
    clean = require('del'),
    uglify = require('gulp-uglify');


var scriptspath = 'src/scripts/**/*.js';
var stylespath = 'src/styles/**/*.less';
var distDirectory = path.join('dist', '/');

gulp.task('styles', function() {
    console.log('Running my styles Task');
    return gulp.src([stylespath])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(minifyCss())
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    console.log('Running my scripts Task');

    if (!fs.existsSync(distDirectory)) {

        shellJS.mkdir('dist');
        console.log(`${ distDirectory } folder : created`);
    }
    return gulp.src([scriptspath])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(browserSync.stream());
});

gulp.task('clean', function() {
    clean('dist');
});

gulp.task('imageMin', () => {
    gulp.src('src/img/*')
        .pipe(imageMin())
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('default', ['scripts', 'styles', ], function() {
    console.log('Running my default Task');
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch(stylespath, ['styles']);
    gulp.watch(scriptspath, ['scripts']);
    gulp.watch(['src/**/*', '*.html', 'styles', 'scripts'], ['scripts', 'styles'], browserSync.reload);

});