const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    minifyCss = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    imageMin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    path = require('path'),
    fs = require('fs'),
    del = require('del'),
    uglify = require('gulp-uglify');


const scriptspath = 'src/scripts/**/*.js';
const stylespath = 'src/styles/**/*.less';
const distDirectory = path.join('dist', '/');

function styles() {
    console.log('Running my styles Task');
    return gulp.src([stylespath])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(minifyCss())
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/styles/'))
        .pipe(browserSync.stream());
}

function scripts() {
    console.log('Running my scripts Task');

    if (!fs.existsSync(distDirectory)) {

       fs.mkdirSync('dist');
        console.log(`${ distDirectory } folder : created`);
    }
    return gulp.src([scriptspath])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(browserSync.stream());
}

function clean(done) {
    del('dist');
    done();
}

function image() {
    gulp.src('src/img/*')
        .pipe(imageMin())
        .pipe(gulp.dest('dist/img/'));
}

function server() {
    console.log('Running my default Task');
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

}

function watch() {
    gulp.watch(stylespath, styles);
    gulp.watch(scriptspath, scripts);
    gulp.watch(['src/**/*', '*.html', 'styles', 'scripts'], scripts, styles, browserSync.reload);

}

var build = gulp.series(clean, gulp.parallel(styles, scripts, server, watch));

gulp.task('build', build);

gulp.task('default', build);

exports.server = server;
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;